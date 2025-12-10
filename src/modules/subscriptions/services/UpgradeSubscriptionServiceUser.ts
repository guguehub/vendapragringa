import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import UpgradeUserTierService from '@modules/users/services/UpgradeUserTierService';

interface IRequest {
  userId: string;
  tier: SubscriptionTier;
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject(UpgradeUserTierService)
    private upgradeUserTierService: UpgradeUserTierService,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    if (!tier || !Object.values(SubscriptionTier).includes(tier)) {
      throw new AppError(`Invalid tier: ${tier}`, 400);
    }

    let subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      subscription = await this.subscriptionsRepository.create({
        userId,
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date(),
        expires_at: null,
        isTrial: false,
        scrape_balance: 0,
      });
    }

    const previousBalance = subscription.scrape_balance || 0;
    const bonusMap: Record<SubscriptionTier, number> = {
      [SubscriptionTier.FREE]: 10,
      [SubscriptionTier.BRONZE]: 100,
      [SubscriptionTier.SILVER]: 300,
      [SubscriptionTier.GOLD]: 600,
      [SubscriptionTier.INFINITY]: 999999,
    };

    const bonus = bonusMap[tier] ?? 0;

    subscription.scrape_balance = previousBalance + bonus;
    subscription.tier = tier;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.updated_at = new Date();

    if ([SubscriptionTier.FREE, SubscriptionTier.INFINITY].includes(tier)) {
      subscription.expires_at = null;
    } else {
      subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    await this.subscriptionsRepository.save(subscription);

    // 🔸 Atualiza quotas e tier do usuário
    await this.upgradeUserTierService.execute(userId, tier);

    // 🔹 Atualiza cache (invalida os dois níveis)
    try {
      const cacheUser = `user:${userId}`;
      const cacheSub = `user-subscription-${userId}`;
      await RedisCache.invalidate(cacheUser);
      await RedisCache.invalidate(cacheSub);
      console.log(`[USER] Cache invalidado: ${cacheUser} e ${cacheSub}`);
    } catch (err) {
      console.error('[USER] ⚠️ Falha ao invalidar caches:', err);
    }

    console.log('[USER] Upgrade concluído. Novo saldo:', subscription.scrape_balance);
    return subscription;
  }
}
