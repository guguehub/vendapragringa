import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@injectable()
export default class UpdateSubscriptionServiceAdmin {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute(data: UpdateSubscriptionDto): Promise<void> {
    const { subscriptionId, tier, status, expires_at, isTrial, cancelled_at, scrape_balance } = data;

    if (!subscriptionId) throw new AppError('subscriptionId is required for admin update');

    const subscription = await this.subscriptionsRepository.findById(subscriptionId);
    if (!subscription) throw new AppError('Subscription not found');

    console.log('[ADMIN] Atualizando assinatura:', subscription.id);

    // Atualiza tier
    if (tier) {
      const normalizedTier = tier.toLowerCase() as SubscriptionTier;
      if (!Object.values(SubscriptionTier).includes(normalizedTier)) {
        throw new AppError(`Invalid tier: ${tier}`, 400);
      }

      const previousBalance = subscription.scrape_balance || 0;
      const bonus =
        normalizedTier === SubscriptionTier.BRONZE
          ? 100
          : normalizedTier === SubscriptionTier.SILVER
          ? 300
          : normalizedTier === SubscriptionTier.GOLD
          ? 600
          : normalizedTier === SubscriptionTier.INFINITY
          ? 999999
          : 0;

      subscription.scrape_balance = previousBalance + bonus;
      subscription.tier = normalizedTier;

      if ([SubscriptionTier.FREE, SubscriptionTier.INFINITY].includes(normalizedTier)) {
        subscription.expires_at = null;
      } else {
        subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      }
    }

    // Atualiza status e flags
    if (status) {
      if (!Object.values(SubscriptionStatus).includes(status)) {
        throw new AppError(`Invalid status: ${status}`, 400);
      }
      subscription.status = status;
    }

    if (expires_at) subscription.expires_at = new Date(expires_at);
    if (cancelled_at) subscription.cancelled_at = new Date(cancelled_at);
    if (isTrial !== undefined) subscription.isTrial = isTrial;
    if (scrape_balance !== undefined) subscription.scrape_balance = scrape_balance;

    subscription.updated_at = new Date();
    await this.subscriptionsRepository.save(subscription);

    const cacheKey = `user-subscription-${subscription.userId}`;
    await RedisCache.invalidate(cacheKey);
    console.log('[ADMIN] Cache invalidado:', cacheKey);
  }
}
