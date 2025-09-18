import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

interface IRequest {
  userId: string;
  tier: string; // pode vir como string do request
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    console.log('[DEBUG][USER] Atualizando assinatura do usuário:', userId, 'para tier:', tier);

    if (!tier || typeof tier !== 'string') {
      throw new AppError('Tier is required and must be a string', 400);
    }

    const normalizedTier = tier.toLowerCase();

    if (!Object.values(SubscriptionTier).includes(normalizedTier as SubscriptionTier)) {
      throw new AppError(`Invalid tier: ${tier}`, 400);
    }

    let subscription = await this.subscriptionsRepository.findByUserId(userId);

    // Se não existir assinatura, cria FREE automaticamente
    if (!subscription) {
      console.log('[DEBUG][USER] Nenhuma assinatura encontrada, criando FREE automaticamente');
      subscription = await this.subscriptionsRepository.create({
        userId,
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date(),
        expires_at: null,
        isTrial: false,
      });
    }

    // Atualiza assinatura
    subscription.tier = normalizedTier as SubscriptionTier;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.updated_at = new Date();

    if (normalizedTier === SubscriptionTier.INFINITY) {
      subscription.expires_at = null;
    } else if (normalizedTier === SubscriptionTier.FREE) {
      subscription.expires_at = null;
    } else {
      // Para planos pagos normais, define 1 ano de validade
      subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    subscription = await this.subscriptionsRepository.save(subscription);

    // Invalida cache do usuário
    const cacheKey = `user-subscription-${userId}`;
    await RedisCache.invalidate(cacheKey);
    console.log('[CACHE INVALIDATED][USER] Chave removida:', cacheKey);

    console.log('[DEBUG][USER] Assinatura atualizada com sucesso:', subscription.id);

    return subscription;
  }
}
