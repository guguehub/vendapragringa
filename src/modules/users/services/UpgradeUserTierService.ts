// src/modules/subscriptions/services/UpgradeUserTierService.ts
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

import UserQuotaService from '@modules/user_quota/services/UserQuotaService';

@injectable()
export default class UpgradeUserTierService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject(UserQuotaService)
    private userQuotaService: UserQuotaService,
  ) {}

  public async execute(userId: string, newTier: SubscriptionTier): Promise<void> {
    // 1️⃣ Busca o usuário
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new AppError('User not found.');

    // 2️⃣ Busca a assinatura
    const subscription = await this.subscriptionsRepository.findByUserId(userId);
    if (!subscription) {
      console.warn(`[UpgradeUserTierService] ⚠️ Nenhuma assinatura vinculada ao usuário ${user.id}.`);
      return;
    }

    const oldTier = subscription.tier;
    subscription.tier = newTier;

    await this.subscriptionsRepository.save(subscription);

    // 3️⃣ Reseta quotas conforme o novo tier (garante valores corretos e sincronizados)
    await this.userQuotaService.resetQuotaForTier(userId, newTier);

    // 4️⃣ Sincroniza saldo com a assinatura
    try {
      const quota = await this.userQuotaService.getUserQuota(userId);

      if (quota) {
        const oldBalance = quota.scrape_balance;
        const subscriptionBalance = subscription.scrape_balance ?? oldBalance ?? 0;
        quota.scrape_balance = subscriptionBalance;

        await this.userQuotaService.refreshCache(userId);

        console.log(
          `[UpgradeUserTierService] 💰 Saldo sincronizado: subscription = ${subscriptionBalance} | quota: ${oldBalance} → ${quota.scrape_balance}`,
        );
      }
    } catch (err) {
      console.error('[UpgradeUserTierService] ⚠️ Falha ao sincronizar saldo de quota:', err);
    }

    // 5️⃣ Limpa e reconstrói o cache completo
    try {
      await RedisCache.invalidate(`user:${userId}`);
      await RedisCache.invalidate(`user-subscription-${userId}`);

      console.log(`[UpgradeUserTierService] 🧹 Cache invalidado para user:${userId}`);

      await this.userQuotaService.refreshCache(userId);
      console.log(`[UpgradeUserTierService] 🔁 Cache recarregado com saldo atualizado para user:${userId}`);
    } catch (err) {
      console.error('[UpgradeUserTierService] ⚠️ Falha ao invalidar/recarregar cache:', err);
    }

    console.log(`[UpgradeUserTierService] ✅ Tier atualizado: ${oldTier} → ${newTier}`);
  }
}
