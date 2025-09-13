import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

interface IRequest {
  userId: string;
  tier: SubscriptionTier;
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<void> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for this user');
    }

    subscription.tier = tier;
    subscription.updated_at = new Date();

    if (tier === SubscriptionTier.INFINITY) {
      subscription.expires_at = null;
    } else {
      subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    subscription.status = SubscriptionStatus.ACTIVE;

    await this.subscriptionsRepository.save(subscription);

    // 🚀 Invalida cache
    await RedisCache.invalidate(`user-subscription-${userId}`);
  }
}
