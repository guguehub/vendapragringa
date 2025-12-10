import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import UpdateUserQuotaOnTierChangeService from '@modules/user_quota/services/UpdateUserQuotaOnTierChangeService';

@injectable()
export default class UpgradeUserTierService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject(UserQuotaService)
    private userQuotaService: UserQuotaService,

    @inject(UpdateUserQuotaOnTierChangeService)
    private updateUserQuotaOnTierChange: UpdateUserQuotaOnTierChangeService,
  ) {}

  public async execute(userId: string, newTier: SubscriptionTier): Promise<void> {
    // 1️⃣ Busca o usuário
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new AppError('User not found.');

    // 2️⃣ Busca a assinatura
    const subscription = await this.subscriptionsRepository.findByUserId(userId);
    if (!subscription) {
      console.warn(`[UpgradeUserTierService] Nenhuma subscription vinculada ao usuário ${user.id}.`);
      return;
    }

    const oldTier = subscription.tier;
    subscription.tier = newTier;

    await this.subscriptionsRepository.save(subscription);

    // 3️⃣ Ajusta quotas conforme o novo tier
    const quota = await this.userQuotaService.getUserQuota(userId);

    if (!quota) {
      await this.userQuotaService.resetQuotaForTier(userId, newTier);
    } else if (oldTier !== newTier) {
      await this.updateUserQuotaOnTierChange.execute(userId, newTier);
    }

    // 🔁 4️⃣ Sincroniza saldo entre assinatura e quota
    try {
      const quotaData = await this.userQuotaService.getUserQuota(userId);

      if (quotaData) {
        const oldBalance = quotaData.scrape_balance;
        quotaData.scrape_balance =
          subscription.scrape_balance ?? quotaData.scrape_balance ?? 0;

        // ⚙️ Atualiza cache de quota antes de invalidar o restante
        await this.userQuotaService.refreshCache(userId);

        console.log(
          `[UpgradeUserTierService] 💰 Saldo sincronizado: subscription = ${subscription.scrape_balance ?? 0} → quota: ${oldBalance} → ${quotaData.scrape_balance}`,
        );
      }
    } catch (err) {
      console.error('[UpgradeUserTierService] ⚠️ Falha ao sincronizar saldo de quota:', err);
    }

    // 5️⃣ Invalida e RECONSTRÓI o cache completo
    try {
      await RedisCache.invalidate(`user-subscription-${userId}`);
      await RedisCache.invalidate(`user:${userId}`);

      console.log(`[UpgradeUserTierService] 🧹 Cache invalidado para user:${userId}`);

      // 🆕 reconstrução: popula novamente a subscription e quota no cache
      await this.userQuotaService.refreshCache(userId);
      console.log(`[UpgradeUserTierService] 🔁 Cache recarregado com saldo atualizado para user:${userId}`);
    } catch (err) {
      console.error('[UpgradeUserTierService] ⚠️ Falha ao invalidar/recarregar cache:', err);
    }

    console.log(`[UpgradeUserTierService] ✅ Tier atualizado: ${oldTier} → ${newTier}`);
  }
}
