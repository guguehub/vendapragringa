import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ISubscriptionsRepository from '../infra/typeorm/repositories/SubscriptionRepository';
import { SubscriptionTier } from '../enums/subscription-tier.enum';

type Tier = SubscriptionTier;

interface IRequest {
  userId: string;
  newTier: Tier;
}

@injectable()
class UpgradeSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) {}

  public async execute({ userId, newTier }: IRequest): Promise<void> {
    const subscription =
      await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for this user');
    }

    subscription.tier = newTier;
    subscription.updatedAt = new Date();

    await this.subscriptionsRepository.save(subscription);
  }
}

export default UpgradeSubscriptionService;
