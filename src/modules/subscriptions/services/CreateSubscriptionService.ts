import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
// Se futuramente for usar cache
// import redisCache from '@shared/cache/RedisCache';

import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';

import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

@injectable()
class CreateSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
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

    // Se o plano for INFINITY, não definimos expires_at
    const subscriptionData: ICreateSubscription = {
      userId,
      tier,
      status,
      start_date: new Date(),
      expires_at:
        tier === SubscriptionTier.INFINITY
          ? null
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Exemplo: plano normal expira em 1 ano
    };

    // Opcional: invalidar cache se houver
    // await redisCache.invalidate(`user-subscription-${userId}`);

    const subscription = await this.subscriptionRepository.create(subscriptionData);

    return subscription;
  }
}

export default CreateSubscriptionService;
