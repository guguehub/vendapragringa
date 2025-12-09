// src/shared/infra/http/middlewares/populateSubscription.ts

import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import RedisCache from '@shared/cache/RedisCache';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

/**
 * 🔹 Converte valores para ISO string (para uso seguro no cache e JSON)
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
 * 🧩 Middleware que popula req.user.subscription
 * Carrega do cache Redis se disponível, caso contrário, busca no banco via serviço
 * Também sincroniza o cache principal (user:<id>) para manter consistência
 */
export default async function populateSubscription(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = req.user;
  if (!user) return next();

  const cacheKey = `user-subscription-${user.id}`;
  console.log(`\n[populateSubscription] 🚀 Iniciando para user:${user.id}`);

  try {
    /**
     * 1️⃣ Tenta obter do cache de assinatura primeiro
     */
    const cached = await RedisCache.recover<{ subscription: any }>(cacheKey);

    if (cached?.subscription) {
      console.log(`[CACHE HIT] ${cacheKey} — Tier: ${cached.subscription.tier}`);

      user.subscription = cached.subscription;

      // 🔁 Sincroniza também o cache principal do usuário
      try {
        const userCacheKey = `user:${user.id}`;
        const cachedUser = await RedisCache.recover<any>(userCacheKey);

        if (cachedUser) {
          cachedUser.subscription = cached.subscription;
          await RedisCache.save(userCacheKey, cachedUser);
          console.log(`[CACHE SYNC] ${userCacheKey} atualizado com assinatura ${cached.subscription.tier}`);
        }
      } catch (cacheErr) {
        console.warn('[populateSubscription] ⚠️ Falha ao sincronizar cache principal do usuário:', cacheErr);
      }

      return next();
    }

    /**
     * 2️⃣ Se não há cache, busca via serviço
     */
    const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
    const result = await checkSubscriptionStatus.execute(user.id);
    const subscription = result?.subscription ?? null;

    console.log('[populateSubscription] 🔍 Resultado do serviço:', {
      found: !!subscription,
      tier: subscription?.tier,
      status: subscription?.status,
      expires_at: subscription?.expires_at,
    });

    /**
     * 3️⃣ Popula o objeto user.subscription
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
      : null;

    /**
     * 4️⃣ Atualiza cache de assinatura
     */
    await RedisCache.save(cacheKey, { subscription: user.subscription });
    console.log(`[CACHE UPDATE] ${cacheKey} atualizado com tier ${subscription?.tier ?? 'null'}`);

    /**
     * 5️⃣ Sincroniza cache principal (user:<id>)
     */
    try {
      const userCacheKey = `user:${user.id}`;
      const cachedUser = await RedisCache.recover<any>(userCacheKey);

      if (cachedUser) {
        cachedUser.subscription = user.subscription;
        await RedisCache.save(userCacheKey, cachedUser);
        console.log(`[CACHE SYNC] ${userCacheKey} sincronizado com assinatura ${subscription?.tier ?? 'null'}`);
      }
    } catch (cacheErr) {
      console.warn('[populateSubscription] ⚠️ Falha ao sincronizar cache principal do usuário:', cacheErr);
    }

    return next();
  } catch (error) {
    console.error('[populateSubscription] ❌ Erro ao carregar assinatura:', error);
    return next();
  }
}
