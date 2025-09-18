// src/modules/subscriptions/services/UpgradeSubscriptionServiceUser.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

interface IRequest {
  userId: string;
  tier: SubscriptionTier | string;
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    console.log('[DEBUG][USER] Atualizando assinatura do usuário:', userId, 'para tier:', tier);

    // Valida tier (case-insensitive)
    const normalizedTier = tier.toString().toUpperCase() as SubscriptionTier;
    if (!Object.values(SubscriptionTier).includes(normalizedTier)) {
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

    // Atualiza assinatura para o tier desejado
    subscription.tier = normalizedTier;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.updated_at = new Date();

    if (normalizedTier === SubscriptionTier.INFINITY) {
      subscription.expires_at = null;
    } else if (normalizedTier !== SubscriptionTier.FREE) {
      subscription.expires_at = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    subscription = await this.subscriptionsRepository.save(subscription);

    // 🚀 Invalida cache
    const cacheKey = `user:${userId}`;
    await RedisCache.invalidate(cacheKey);

    console.log('[DEBUG][USER] Assinatura atualizada com sucesso:', subscription.id);

    return subscription;
  }
}
