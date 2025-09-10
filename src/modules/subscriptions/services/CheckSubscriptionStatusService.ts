import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../infra/typeorm/entities/Subscription';

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

    // 1️⃣ Tenta recuperar do cache
    const cached = await RedisCache.recover<{
      isActive: boolean;
      tier: SubscriptionTier;
      subscription: Subscription | undefined;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // 2️⃣ Consulta o banco
    const subscription = await this.subscriptionsRepository.findActiveByUserId(userId);

    if (!subscription) {
      const result = {
        isActive: false,
        tier: SubscriptionTier.FREE,
        subscription: undefined,
      };

      await RedisCache.save(cacheKey, result, 3600); // 1 hora de cache
      return result;
    }

    const now = new Date();
    let isActive = true;

    // Infinity nunca expira
    if (
      subscription.tier !== SubscriptionTier.INFINITY &&
      (subscription.expiresAt === null || subscription.expiresAt < now)
    ) {
      isActive = false;
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      isActive = false;
    }

    const result = {
      isActive,
      tier: subscription.tier,
      subscription,
    };

    // 3️⃣ Salva no cache (exceto Infinity que pode ter cache sem expiração)
    if (subscription.tier === SubscriptionTier.INFINITY) {
      await RedisCache.save(cacheKey, result);
    } else {
      await RedisCache.save(cacheKey, result, 3600); // 1 hora
    }

    return result;
  }
}

export default CheckSubscriptionStatusService;
