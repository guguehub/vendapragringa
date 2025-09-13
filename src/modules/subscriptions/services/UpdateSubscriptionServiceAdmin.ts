import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';
//import { SubscriptionStatus } from '../infra/typeorm/entities/Subscription';

@injectable()
export default class UpdateSubscriptionServiceAdmin {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute(data: UpdateSubscriptionDto): Promise<void> {
    const subscriptionId = data.subscriptionId;
    if (!subscriptionId) throw new AppError('subscriptionId is required for admin update');

    const subscription = await this.subscriptionsRepository.findById(subscriptionId);

    if (!subscription) throw new AppError('Subscription not found');

    if (data.tier) subscription.tier = data.tier;
    if (data.status) subscription.status = data.status;
    if (data.expires_at) subscription.expires_at = new Date(data.expires_at);

    subscription.updated_at = new Date();

    await this.subscriptionsRepository.save(subscription);

    // 🚀 Invalida cache
    await RedisCache.invalidate(`user-subscription-${subscription.userId}`);
  }
}
