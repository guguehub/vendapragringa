import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import AppError from '@shared/errors/AppError';

export default async function populateSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
  const status = await checkSubscriptionStatus.execute(req.user.id);

  req.user.subscription = status.subscription;
  return next();
}

