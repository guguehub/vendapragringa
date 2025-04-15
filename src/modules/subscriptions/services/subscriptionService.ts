import { getRepository } from 'typeorm';
import { Subscription } from '../models/Subscription';

export const getSubscriptionForUser = async (
  userId: string,
): Promise<Subscription | null> => {
  const subscriptionRepository = getRepository(Subscription);
  return subscriptionRepository.findOne({ where: { user: { id: userId } } });
};

export const createOrUpdateSubscription = async (
  userId: string,
  tier: Subscription['tier'],
  expiresAt: Date | null,
): Promise<Subscription> => {
  const subscriptionRepository = getRepository(Subscription);
  let subscription = await subscriptionRepository.findOne({
    where: { user: { id: userId } },
  });

  if (subscription) {
    subscription.tier = tier;
    subscription.expiresAt = expiresAt;
  } else {
    subscription = subscriptionRepository.create({
      user: { id: userId },
      tier,
      expiresAt,
    });
  }

  return subscriptionRepository.save(subscription);
};
