// src/modules/subscriptions/infra/http/middlewares/populateSubscription.ts

import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import RedisCache from '@shared/cache/RedisCache';

/**
 * 🔹 Conversor seguro de datas para formato ISO
 */
const toISO = (value: any): string | null => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();

  try {
    const d = new Date(value);
    return !Number.isNaN(d.getTime()) ? d.toISOString() : null;
  } catch {
    return null;
  }
};

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
    // 🔹 1️⃣ Tenta obter do cache primeiro
    const cached = await RedisCache.recover<{ subscription: any }>(cacheKey);
    if (cached?.subscription) {
      console.log(`[CACHE HIT] ${cacheKey} encontrado — Tier: ${cached.subscription.tier}`);
      user.subscription = cached.subscription;
      return next();
    }

    // 🔹 2️⃣ Se não há cache, busca no serviço
    const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
    const result = await checkSubscriptionStatus.execute(user.id);
    const subscription = result?.subscription ?? null;

    console.log('[populateSubscription] 🔍 Resultado do serviço:', {
      found: !!subscription,
      tier: subscription?.tier,
      status: subscription?.status,
      expires_at: subscription?.expires_at,
    });

    // 🔹 3️⃣ Popula os dados do user (ou null)
    user.subscription = subscription
      ? {
          id: subscription.id,
          status: subscription.status,
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

    // 🔹 4️⃣ Atualiza o cache
    await RedisCache.save(cacheKey, { subscription: user.subscription });
    console.log(`[CACHE UPDATE] ${cacheKey} atualizado com tier ${subscription?.tier ?? 'null'}`);

    return next();
  } catch (error) {
    console.error('[populateSubscription] ❌ Erro ao carregar assinatura:', error);
    return next();
  }
}
