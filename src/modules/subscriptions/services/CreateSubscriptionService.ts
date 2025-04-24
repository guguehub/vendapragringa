import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
// If you plan to cache subscriptions
// import redisCache from '@shared/cache/RedisCache';

import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';
//import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionRepository';
import { ISubscriptionRepository } from '../domain/repositories/ICreateSubscription';

@injectable()
class CreateSubscriptionService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionRepository: ISubscriptionRepository,
  ) {}

  public async execute({
    user_id,
    plan,
    status,
  }: ICreateSubscription): Promise<ISubscription> {
    const existingSubscription =
      await this.subscriptionRepository.findByUserId(user_id);

    if (existingSubscription) {
      throw new AppError('This user already has a subscription');
    }

    // Optional: invalidate cache if needed
    // await redisCache.invalidate(`user-subscription-${user_id}`);

    const subscription = await this.subscriptionRepository.create({
      user_id,
      plan,
      status,
    });

    return subscription;
  }
}

export default CreateSubscriptionService;
