import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
//import ISubscriptionsRepository from '../domain/repositories/ISubscriptionsRepository';
import ISubscriptionsRepository from '../infra/typeorm/repositories/SubscriptionRepository';

type Tier = 'free' | 'bronze' | 'silver' | 'gold';

interface IRequest {
  userId: string;
  newPlan: Tier;
}

@injectable()
class UpgradeSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionsRepository,
  ) {}

  public async execute({ userId, newPlan }: IRequest): Promise<void> {
    const subscription =
      await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for this user');
    }

    subscription.plan = newPlan;
    subscription.updatedAt = new Date();

    await this.subscriptionsRepository.save(subscription);
  }
}

export default UpgradeSubscriptionService;
