import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
// If you plan to cache subscriptions
// import redisCache from '@shared/cache/RedisCache';

import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';

@injectable()
class CreateSubscriptionService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  public async execute({
    userId,
    tier,
    status,
  }: ICreateSubscription): Promise<ISubscription> {
    const existingSubscription =
      await this.subscriptionRepository.findByUserId(userId);

    if (existingSubscription) {
      throw new AppError('This user already has a subscription');
    }

    // Optional: invalidate cache if needed
    // await redisCache.invalidate(`user-subscription-${user_id}`);

    const subscription = await this.subscriptionRepository.create({
      userId,
      tier,
      status,
    });

    return subscription;
  }
}

export default CreateSubscriptionService;
