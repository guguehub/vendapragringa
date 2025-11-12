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

    console.log('[ADMIN] Atualizando assinatura:', subscription.id);

    /**
     * 🔹 Atualiza o tier e saldo acumulado
     */
    if (tier) {
      const previousBalance = subscription.scrape_balance || 0;

      const bonusMap: Record<SubscriptionTier, number> = {
        [SubscriptionTier.FREE]: 0,
        [SubscriptionTier.BRONZE]: 100,
        [SubscriptionTier.SILVER]: 300,
        [SubscriptionTier.GOLD]: 600,
        [SubscriptionTier.INFINITY]: 999999,
      };

      const bonus = bonusMap[tier] ?? 0;

      subscription.scrape_balance = previousBalance + bonus;
      subscription.tier = tier;

      // Se for plano vitalício ou gratuito, não expira
      if ([SubscriptionTier.FREE, SubscriptionTier.INFINITY].includes(tier)) {
        subscription.expires_at = null;
      } else {
        // Caso contrário, renova por 1 ano
        subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      }

      // 🔸 Atualiza também o tier do usuário e suas quotas
      await this.upgradeUserTierService.execute(subscription.userId, tier);
    }

    /**
     * 🔹 Atualiza status e flags administrativas
     */
    if (status) subscription.status = status;
    if (expires_at) subscription.expires_at = new Date(expires_at);
    if (cancelled_at) subscription.cancelled_at = new Date(cancelled_at);
    if (isTrial !== undefined) subscription.isTrial = isTrial;
    if (scrape_balance !== undefined) subscription.scrape_balance = scrape_balance;

    subscription.updated_at = new Date();

    await this.subscriptionsRepository.save(subscription);

    /**
     * 🔁 Atualiza o cache no Redis
     */
    const cacheKey = `user-subscription-${subscription.userId}`;

    // 1️⃣ Invalida o cache antigo
    await RedisCache.invalidate(cacheKey);
    console.log('[ADMIN] Cache antigo invalidado:', cacheKey);

    // 2️⃣ Grava o novo cache com os dados atualizados
    await RedisCache.save(cacheKey, { subscription });
    console.log('[ADMIN] Cache regravado com assinatura atualizada:', subscription.id);

    return subscription;
  }
}
