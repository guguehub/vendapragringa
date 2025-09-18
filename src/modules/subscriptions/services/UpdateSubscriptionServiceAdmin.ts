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
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute(data: UpdateSubscriptionDto): Promise<void> {
    const { subscriptionId, tier, status, expires_at } = data;

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
      if (!Object.values(SubscriptionTier).includes(tier as SubscriptionTier)) {
        throw new AppError(`Invalid tier: ${tier}`, 400);
      }
      subscription.tier = tier as SubscriptionTier;
      console.log('[DEBUG][ADMIN] Tier atualizado para:', tier);
    }

    // Atualiza status se fornecido
    if (status) {
      if (!Object.values(SubscriptionStatus).includes(status as SubscriptionStatus)) {
        throw new AppError(`Invalid status: ${status}`, 400);
      }
      subscription.status = status as SubscriptionStatus;
      console.log('[DEBUG][ADMIN] Status atualizado para:', status);
    }

    // Atualiza expires_at se fornecido
    if (expires_at) {
      subscription.expires_at = new Date(expires_at);
      console.log('[DEBUG][ADMIN] expires_at atualizado para:', subscription.expires_at);
    }

    subscription.updated_at = new Date();

    await this.subscriptionsRepository.save(subscription);

    // Invalida cache do usuário
    const cacheKey = `user:${subscription.userId}`;
    await RedisCache.invalidate(cacheKey);
    console.log('[CACHE INVALIDATED][ADMIN] Chave removida:', cacheKey);

    console.log('[DEBUG][ADMIN] Assinatura atualizada com sucesso:', subscription.id);
  }
}
