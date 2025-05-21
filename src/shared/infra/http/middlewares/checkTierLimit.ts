import { Request, Response, NextFunction } from 'express';
import AppDataSource from '@shared/infra/typeorm';
import Item from '../../../../modules/item/infra/typeorm/entities/Item';
import { Subscription } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

const tierLimits = {
  free: 4,
  bronze: 20,
  silver: 50,
  gold: 150,
};

export async function checkTierLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const userId = req.user.id;

  const itemRepository = AppDataSource.getRepository(Item);
  const subscriptionRepository = AppDataSource.getRepository(Subscription);

  const subscription = await subscriptionRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  const tier = subscription?.tier ?? 'free';
  const limit = tierLimits[tier];

  const userItemsCount = await itemRepository.count({
    where: { user: { id: userId } }, // ou { userId } se não for relação
  });

  if (userItemsCount >= limit) {
    return res.status(403).json({
      message: `Item limit reached for your plan (${tier}). Please upgrade to add more items.`,
    });
  }

  return next();
}
