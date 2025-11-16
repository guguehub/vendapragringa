import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import UpgradeUserTierService from '@modules/users/services/UpgradeUserTierService';

@injectable()
export default class UpdateSubscriptionServiceAdmin {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject(UpgradeUserTierService)
    private upgradeUserTierService: UpgradeUserTierService,
  ) {}

  public async execute(data: UpdateSubscriptionDto) {
    const { subscriptionId, tier, status, expires_at, isTrial, cancelled_at, scrape_balance } = data;

    if (!subscriptionId) {
      throw new AppError('subscriptionId is required for admin update');
    }

    const subscription = await this.subscriptionsRepository.findById(subscriptionId);
    if (!subscription) {
      throw new AppError('Subscription not found');
    }

    console.log(`\n[ADMIN] Atualizando assinatura ${subscription.id} (usuário: ${subscription.userId})`);

    // 🧩 Tier anterior (para log)
    const prevTier = subscription.tier;
    const prevBalance = subscription.scrape_balance || 0;

    /**
     * 🔹 Atualiza o tier e saldo acumulado
     */
    if (tier) {
      const bonusMap: Record<SubscriptionTier, number> = {
        [SubscriptionTier.FREE]: 10,
        [SubscriptionTier.BRONZE]: 100,
        [SubscriptionTier.SILVER]: 300,
        [SubscriptionTier.GOLD]: 600,
        [SubscriptionTier.INFINITY]: 999999,
      };

      const bonus = bonusMap[tier] ?? 0;
      subscription.scrape_balance = prevBalance + bonus;
      subscription.tier = tier;

      // Se for plano vitalício ou gratuito → não expira
      if ([SubscriptionTier.FREE, SubscriptionTier.INFINITY].includes(tier)) {
        subscription.expires_at = null;
      } else {
        // Renova por 1 ano a partir de agora
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        subscription.expires_at = oneYearLater;
      }

      // Atualiza tier e quotas do usuário
      await this.upgradeUserTierService.execute(subscription.userId, tier);

      console.log(
        `[ADMIN] Tier alterado: ${prevTier} → ${tier}. Bônus aplicado: ${bonus}. Saldo anterior: ${prevBalance}, atual: ${subscription.scrape_balance}`,
      );
    }

    /**
     * 🔹 Atualiza status e flags administrativas
     */
    if (status) subscription.status = status;
    if (expires_at) subscription.expires_at = new Date(expires_at);
    if (cancelled_at) subscription.cancelled_at = new Date(cancelled_at);
    if (isTrial !== undefined) subscription.isTrial = isTrial;
    if (scrape_balance !== undefined) subscription.scrape_balance = scrape_balance;

    subscription.updated_at = new Date(Date.now());

    await this.subscriptionsRepository.save(subscription);

    /**
     * 🔁 Atualiza o cache no Redis
     */
    const cacheKey = `user-subscription-${subscription.userId}`;

    try {
      // 1️⃣ Invalida o cache antigo
      await RedisCache.invalidate(cacheKey);
      console.log(`[ADMIN] Cache antigo invalidado: ${cacheKey}`);

      // 2️⃣ Regrava cache atualizado
      await RedisCache.save(cacheKey, { subscription });
      console.log(`[ADMIN] Cache atualizado para assinatura: ${subscription.id}`);
    } catch (err) {
      console.error('[ADMIN] ⚠️ Falha ao atualizar cache Redis:', err);
    }

    console.log('[ADMIN] ✅ Assinatura atualizada com sucesso.\n');

    return subscription;
  }
}
