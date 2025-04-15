import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

type Tier = 'free' | 'bronze' | 'silver' | 'gold';

const tierHierarchy: Tier[] = ['free', 'bronze', 'silver', 'gold'];

export function ensureTier(requiredTier: Tier) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.subscription || !user.subscription.plan) {
      throw new AppError('Subscription information not found', 403);
    }

    const userTierIndex = tierHierarchy.indexOf(user.subscription.plan);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    if (userTierIndex < requiredTierIndex) {
      throw new AppError('Insufficient subscription tier', 403);
    }

    return next();
  };
}
