// src/shared/infra/http/middlewares/populateSubscription.ts

import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';
import RedisCache from '@shared/cache/RedisCache';

/**
 * 🔹 Converte valores em ISO para serialização segura
 */
function toISO(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  try {
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null;
  } catch {
    return null;
  }
}

/**
 * 🧩 Middleware que garante que req.user.subscription e req.user.quota
 * estejam sempre sincronizados com o Redis e com o estado real no banco.
 */
export default async function populateSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = req.user;
  if (!user) return next();

  const cacheKey = `user-subscription-${user.id}`;
  const userCacheKey = `user:${user.id}`;

  console.log(`\n[populateSubscription] 🚀 Iniciando para user:${user.id}`);

  try {
    /**
     * 1️⃣ Tenta recuperar do cache de assinatura
     */
    const cached = await RedisCache.recover<{ subscription: any }>(cacheKey);

    if (cached?.subscription) {
      console.log(`[CACHE HIT] ${cacheKey} — Tier: ${cached.subscription.tier}`);
      user.subscription = cached.subscription;

      // 🔁 Sincroniza também o cache principal
      const cachedUser = await RedisCache.recover<any>(userCacheKey);
      if (cachedUser) {
        cachedUser.subscription = cached.subscription;

        // ⚙️ Sincroniza quota do usuário com a assinatura (saldo real)
        cachedUser.quota = {
          ...(cachedUser.quota ?? {}),
          scrape_balance: cached.subscription.scrape_balance ?? 0,
          total_scrapes_used: cached.subscription.total_scrapes_used ?? 0,
        };

        await RedisCache.save(userCacheKey, cachedUser, 300);
        console.log(
          `[CACHE SYNC] ${userCacheKey} sincronizado com assinatura ${cached.subscription.tier} (saldo: ${cached.subscription.scrape_balance})`,
        );
      }

      // ✅ Sincroniza req.user em tempo real
      req.user.subscription = cached.subscription;
      req.user.quota = {
        ...(req.user.quota ?? {}),
        scrape_balance: cached.subscription.scrape_balance ?? 0,
        total_scrapes_used: cached.subscription.total_scrapes_used ?? 0,
      };

      return next();
    }

    /**
     * 2️⃣ CACHE MISS → Buscar via serviço
     */
    console.log(`[CACHE MISS] Nenhuma assinatura encontrada em cache, consultando serviço...`);
    const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
    const result = await checkSubscriptionStatus.execute(user.id);
    const subscription = result?.subscription ?? null;

    /**
     * 3️⃣ Normaliza e popula o objeto de assinatura
     */
    user.subscription = subscription
      ? {
          id: subscription.id,
          status: subscription.status as SubscriptionStatus,
          tier: subscription.tier as SubscriptionTier,
          start_date: toISO(subscription.start_date),
          expires_at: toISO(subscription.expires_at),
          isTrial: subscription.isTrial,
          cancelled_at: toISO(subscription.cancelled_at),
          userId: subscription.userId,
          created_at: toISO(subscription.created_at),
          updated_at: toISO(subscription.updated_at),
          scrape_balance: subscription.scrape_balance ?? 0,
          total_scrapes_used: subscription.total_scrapes_used ?? 0,
        }
      : {
          id: '',
          status: SubscriptionStatus.ACTIVE,
          tier: SubscriptionTier.FREE,
          start_date: null,
          expires_at: null,
          isTrial: false,
          cancelled_at: null,
          userId: user.id,
          created_at: null,
          updated_at: null,
          scrape_balance: 0,
          total_scrapes_used: 0,
        };

    /**
     * 4️⃣ Atualiza caches de forma sincronizada
     */
    await RedisCache.save(cacheKey, { subscription: user.subscription }, 300);
    console.log(`[CACHE UPDATE] ${cacheKey} salvo com tier ${user.subscription.tier}`);

    const cachedUser = await RedisCache.recover<any>(userCacheKey);
    if (cachedUser) {
      cachedUser.subscription = user.subscription;

      cachedUser.quota = {
        ...(cachedUser.quota ?? {}),
        scrape_balance: user.subscription.scrape_balance ?? 0,
        total_scrapes_used: user.subscription.total_scrapes_used ?? 0,
      };

      await RedisCache.save(userCacheKey, cachedUser, 300);
      console.log(
        `[CACHE SYNC] ${userCacheKey} sincronizado com assinatura ${user.subscription.tier} (saldo: ${user.subscription.scrape_balance})`,
      );
    }

    // ✅ Garante que req.user está atualizado
    req.user.subscription = user.subscription;
    req.user.quota = {
      ...(req.user.quota ?? {}),
      scrape_balance: user.subscription.scrape_balance ?? 0,
      total_scrapes_used: user.subscription.total_scrapes_used ?? 0,
    };

    return next();
  } catch (error) {
    console.error('[populateSubscription] ❌ Erro ao carregar assinatura:', error);
    return next();
  }
}
