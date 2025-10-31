// src/modules/subscriptions/services/CheckSubscriptionStatusService.ts
import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

type CheckResult = {
  isActive: boolean;
  tier: SubscriptionTier;
  subscription: Subscription | undefined;
};

@injectable()
class CheckSubscriptionStatusService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  private isActive(subscription: Subscription): boolean {
    if (subscription.status === SubscriptionStatus.CANCELLED) return false;
    if (subscription.tier === SubscriptionTier.INFINITY) return true;
    if (!subscription.expires_at) return false;
    const expires = subscription.expires_at instanceof Date
      ? subscription.expires_at
      : new Date(subscription.expires_at);
    return expires.getTime() > Date.now();
  }

  private normalizeSubscriptionDates(sub?: Subscription): Subscription | undefined {
    if (!sub) return undefined;

    const normalized: any = { ...sub };
    const dateFields = ['start_date', 'expires_at', 'cancelled_at', 'created_at', 'updated_at'];

    for (const field of dateFields) {
      const val = normalized[field];
      if (!val) {
        normalized[field] = null;
        continue;
      }
      if (val instanceof Date) continue;
      try {
        const d = new Date(val);
        normalized[field] = !Number.isNaN(d.getTime()) ? d : null;
      } catch {
        normalized[field] = null;
      }
    }

    // 🔹 Campos de quota para compatibilidade com populateSubscription
    normalized.scrape_balance = normalized.scrape_balance ?? 0;
    normalized.total_scrapes_used = normalized.total_scrapes_used ?? 0;

    // 🔹 LOG da subscription normalizada
    console.log('[CheckSubscriptionStatusService] subscription normalizada:', normalized);

    return normalized as Subscription;
  }

  public async execute(userId: string): Promise<CheckResult> {
    const cacheKey = `user-subscription-${userId}`;
    const cached = await RedisCache.recover<CheckResult>(cacheKey);

    if (cached) {
      const normalizedSubscription = this.normalizeSubscriptionDates(cached.subscription as any);
      return {
        isActive: cached.isActive,
        tier: cached.tier,
        subscription: normalizedSubscription,
      };
    }

    const subscription = await this.subscriptionsRepository.findActiveByUserId(userId);
    const normalized = this.normalizeSubscriptionDates(subscription as any);

    const result: CheckResult = normalized
      ? { isActive: this.isActive(normalized), tier: normalized.tier, subscription: normalized }
      : { isActive: false, tier: SubscriptionTier.FREE, subscription: undefined };

    await RedisCache.save(
      cacheKey,
      result,
      result.subscription?.tier === SubscriptionTier.INFINITY ? undefined : 3600,
    );

    return result;
  }
}

export default CheckSubscriptionStatusService;
