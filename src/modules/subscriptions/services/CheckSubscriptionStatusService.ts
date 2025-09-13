import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@injectable()
class CheckSubscriptionStatusService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  private isActive(subscription: Subscription): boolean {
    if (subscription.status === SubscriptionStatus.CANCELLED) return false;
    if (subscription.tier === SubscriptionTier.INFINITY) return true;
    return subscription.expires_at != null && subscription.expires_at > new Date();
  }

  public async execute(userId: string): Promise<{
    isActive: boolean;
    tier: SubscriptionTier;
    subscription: Subscription | undefined;
  }> {
    const cacheKey = `user-subscription-${userId}`;

    const cached = await RedisCache.recover<{
      isActive: boolean;
      tier: SubscriptionTier;
      subscription: Subscription | undefined;
    }>(cacheKey);

    if (cached) return cached;

    const subscription = await this.subscriptionsRepository.findActiveByUserId(userId);

    const result = subscription
      ? { isActive: this.isActive(subscription), tier: subscription.tier, subscription }
      : { isActive: false, tier: SubscriptionTier.FREE, subscription: undefined };

    await RedisCache.save(cacheKey, result, subscription?.tier === SubscriptionTier.INFINITY ? undefined : 3600);

    return result;
  }
}

export default CheckSubscriptionStatusService;
