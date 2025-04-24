import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import Subscription from '../infra/typeorm/entities/Subscription';
import ISubscriptionsRepository from '../domain/repositories/ISubscriptionsRepository';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../enums/subscription-tier.enum';

@injectable()
class CheckSubscriptionStatusService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) {}

  public async execute(userId: string): Promise<{
    isActive: boolean;
    tier: SubscriptionTier;
    subscription: Subscription | undefined;
  }> {
    const subscription =
      await this.subscriptionsRepository.findActiveByUserId(userId);

    if (!subscription) {
      return {
        isActive: false,
        tier: SubscriptionTier.FREE,
        subscription: undefined,
      };
    }

    const now = new Date();

    const isExpired = subscription.expiresAt && subscription.expiresAt < now;
    const isCancelled = subscription.status === SubscriptionStatus.CANCELLED;

    const isActive = !isExpired && !isCancelled;

    return {
      isActive,
      tier: subscription.tier,
      subscription,
    };
  }
}

export default CheckSubscriptionStatusService;
