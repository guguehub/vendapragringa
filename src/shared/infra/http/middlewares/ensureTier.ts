import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

const tierHierarchy: SubscriptionTier[] = [
  SubscriptionTier.FREE,
  SubscriptionTier.BRONZE,
  SubscriptionTier.SILVER,
  SubscriptionTier.GOLD,
  SubscriptionTier.INFINITY,
];

export function ensureTier(requiredTier: SubscriptionTier) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.subscription || !user.subscription.tier) {
      throw new AppError('Subscription information not found', 403);
    }

    const userTierIndex = tierHierarchy.indexOf(user.subscription.tier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    if (userTierIndex === -1 || requiredTierIndex === -1) {
      throw new AppError('Invalid subscription tier', 400);
    }

    if (userTierIndex < requiredTierIndex) {
      throw new AppError('Insufficient subscription tier', 403);
    }

    return next();
  };
}
