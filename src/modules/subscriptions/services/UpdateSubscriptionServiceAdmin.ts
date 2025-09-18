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
    const { subscriptionId, tier, status, expires_at, isTrial, cancelled_at } = data;

    if (!subscriptionId) {
      throw new AppError('subscriptionId is required for admin update');
    }

    const subscription = await this.subscriptionsRepository.findById(subscriptionId);

    if (!subscription) {
      throw new AppError('Subscription not found');
    }

    console.log('[DEBUG][ADMIN] Atualizando assinatura:', subscription.id, 'para usuário:', subscription.userId);

    // Atualiza tier se fornecido
    if (tier) {
      if (typeof tier !== 'string') {
        throw new AppError('Tier must be a string', 400);
      }
      console.log('Enum SubscriptionTier:', Object.values(SubscriptionTier));

      const normalizedTier = tier.toLowerCase();
      console.log('Normalized tier:', normalizedTier);

      if (!Object.values(SubscriptionTier).includes(normalizedTier as SubscriptionTier)) {
        throw new AppError(`Invalid tier: ${tier}`, 400);
      }
      subscription.tier = normalizedTier as SubscriptionTier;

      // Ajusta expiration
      if (normalizedTier === SubscriptionTier.INFINITY) {
        subscription.expires_at = null;
      } else if (normalizedTier === SubscriptionTier.FREE) {
        subscription.expires_at = null;
      } else {
        subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      }

      console.log('[DEBUG][ADMIN] Tier atualizado para:', normalizedTier);
    }

    // Atualiza status se fornecido
    if (status) {
      if (!Object.values(SubscriptionStatus).includes(status)) {
        throw new AppError(`Invalid status: ${status}`, 400);
      }
      subscription.status = status;
      console.log('[DEBUG][ADMIN] Status atualizado para:', status);
    }

    // Atualiza expires_at manual se fornecido (apenas admin)
    if (expires_at) subscription.expires_at = new Date(expires_at);
    if (cancelled_at) subscription.cancelled_at = new Date(cancelled_at);
    if (isTrial !== undefined) subscription.isTrial = isTrial;

    subscription.updated_at = new Date();

    await this.subscriptionsRepository.save(subscription);

    // Invalida cache do usuário
    const cacheKey = `user-subscription-${subscription.userId}`;
    await RedisCache.invalidate(cacheKey);
    console.log('[CACHE INVALIDATED][ADMIN] Chave removida:', cacheKey);

    console.log('[DEBUG][ADMIN] Assinatura atualizada com sucesso:', subscription.id);
  }
}
