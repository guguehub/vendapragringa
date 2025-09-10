import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@injectable()
class CheckSubscriptionStatusService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute(userId: string): Promise<{
    isActive: boolean;
    tier: SubscriptionTier;
    subscription: Subscription | undefined;
  }> {
    const cacheKey = `user-subscription-${userId}`;

    // 1️⃣ tenta recuperar do cache
    const cached = await RedisCache.recover<{
      isActive: boolean;
      tier: SubscriptionTier;
      subscription: Subscription | undefined;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // 2️⃣ consulta o banco
    const subscription = await this.subscriptionsRepository.findActiveByUserId(userId);

    if (!subscription) {
      const result = {
        isActive: false,
        tier: SubscriptionTier.FREE,
        subscription: undefined,
      };

      await RedisCache.save(cacheKey, result, 3600); // 1h cache
      return result;
    }

    const now = new Date();
    let isActive = true;

    // Se não for Infinity, precisa ter expires_at válido e futuro
    if (
      subscription.tier !== SubscriptionTier.INFINITY &&
      (!subscription.expires_at || subscription.expires_at < now)
    ) {
      isActive = false;
    }

    // Cancelado nunca é ativo
    if (subscription.status === SubscriptionStatus.CANCELLED) {
      isActive = false;
    }

    const result = {
      isActive,
      tier: subscription.tier,
      subscription,
    };

    // 3️⃣ salva no cache
    if (subscription.tier === SubscriptionTier.INFINITY) {
      await RedisCache.save(cacheKey, result); // sem expiração
    } else {
      await RedisCache.save(cacheKey, result, 3600); // 1h
    }

    return result;
  }
}

export default CheckSubscriptionStatusService;
