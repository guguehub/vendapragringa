import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

interface IRequest {
  userId: string;
  tier: string;
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    if (!tier || typeof tier !== 'string') throw new AppError('Tier is required', 400);
    const normalizedTier = tier.toLowerCase() as SubscriptionTier;

    if (!Object.values(SubscriptionTier).includes(normalizedTier))
      throw new AppError(`Invalid tier: ${tier}`, 400);

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
    const bonus =
      normalizedTier === SubscriptionTier.BRONZE
        ? 100
        : normalizedTier === SubscriptionTier.SILVER
        ? 300
        : normalizedTier === SubscriptionTier.GOLD
        ? 600
        : normalizedTier === SubscriptionTier.INFINITY
        ? 999999
        : 0;

    subscription.scrape_balance = previousBalance + bonus;
    subscription.tier = normalizedTier;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.updated_at = new Date();

    if ([SubscriptionTier.FREE, SubscriptionTier.INFINITY].includes(normalizedTier)) {
      subscription.expires_at = null;
    } else {
      subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    await this.subscriptionsRepository.save(subscription);

    const cacheKey = `user-subscription-${userId}`;
    await RedisCache.invalidate(cacheKey);

    console.log('[USER] Upgrade concluído. Novo saldo:', subscription.scrape_balance);
    return subscription;
  }
}
