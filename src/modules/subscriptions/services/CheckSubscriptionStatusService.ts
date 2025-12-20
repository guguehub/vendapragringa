import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import IUserQuotaRepository from '@modules/user_quota/domain/repositories/IUserQuotaRepository';

type CheckResult = {
  isActive: boolean;
  tier: SubscriptionTier;
  bonus_today?: number; // ✅ novo campo
  subscription: Subscription | undefined;
};

@injectable()
class CheckSubscriptionStatusService {
  constructor(
    @inject('SubscriptionRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject('UserQuotasRepository')
    private userQuotaRepository: IUserQuotaRepository, // ✅ injetado para buscar bonus_today
  ) {}

  private isActive(subscription: Subscription): boolean {
    if (subscription.status === SubscriptionStatus.CANCELLED) return false;
    if (subscription.tier === SubscriptionTier.INFINITY) return true;
    if (!subscription.expires_at) return false;

    const expires =
      subscription.expires_at instanceof Date
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

    normalized.scrape_balance = normalized.scrape_balance ?? 0;
    normalized.total_scrapes_used = normalized.total_scrapes_used ?? 0;

    console.log('[CheckSubscriptionStatusService] subscription normalizada:', normalized);
    return normalized as Subscription;
  }

  public async execute(userId: string): Promise<CheckResult> {
    const cacheKey = `user-subscription-${userId}`;
    const cached = await RedisCache.recover<CheckResult>(cacheKey);

    // 1️⃣ Validação segura do cache existente
    if (cached?.subscription) {
      const normalized = this.normalizeSubscriptionDates(cached.subscription);
      if (normalized) {
        const stillActive = this.isActive(normalized);

        if (stillActive && normalized.tier !== SubscriptionTier.FREE) {
          console.log(`[CACHE VALID] ${cacheKey} — Tier: ${normalized.tier}`);
          return {
            isActive: stillActive,
            tier: normalized.tier,
            bonus_today: cached.bonus_today ?? 0,
            subscription: normalized,
          };
        }

        // 🔸 Caso seja tier FREE ou expirado → cache inválido
        console.log(`[CACHE INVALID] ${cacheKey} — invalidando cache antigo`);
        await RedisCache.invalidate(cacheKey);
      }
    }

    // 2️⃣ Cache inválido → busca assinatura e quota no banco
    const subscription = await this.subscriptionsRepository.findActiveByUserId(userId);
    const normalized = this.normalizeSubscriptionDates(subscription);

    // ✅ Busca o bônus diário atual
    const quota = await this.userQuotaRepository.findByUserId(userId);
    const bonusToday = quota?.daily_bonus_count ?? 0;

    const result: CheckResult = normalized
      ? {
          isActive: this.isActive(normalized),
          tier: normalized.tier,
          bonus_today: bonusToday,
          subscription: normalized,
        }
      : {
          isActive: false,
          tier: SubscriptionTier.FREE,
          bonus_today: bonusToday,
          subscription: undefined,
        };

    // 3️⃣ Atualiza cache de assinatura
    await RedisCache.save(cacheKey, result, 300);
    console.log(`[CACHE UPDATE] ${cacheKey} salvo com tier ${result.tier} (bonus_today=${bonusToday})`);

    // 4️⃣ Sincroniza cache principal (user:<id>)
    try {
      const userCacheKey = `user:${userId}`;
      const cachedUser = await RedisCache.recover<any>(userCacheKey);
      if (cachedUser) {
        cachedUser.subscription = result.subscription;
        cachedUser.quota = {
          ...(cachedUser.quota || {}),
          bonus_today: bonusToday,
        };
        await RedisCache.save(userCacheKey, cachedUser, 300);
        console.log(`[CACHE SYNC] ${userCacheKey} sincronizado com assinatura ${result.tier}`);
      }
    } catch (err) {
      console.warn('[CheckSubscriptionStatusService] ⚠️ Falha ao sincronizar cache principal:', err);
    }

    return result;
  }
}

export default CheckSubscriptionStatusService;
