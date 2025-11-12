// src/modules/subscriptions/infra/http/middlewares/populateSubscription.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import RedisCache from '@shared/cache/RedisCache';

// 🔹 Conversor seguro de datas para formato ISO
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
  next: NextFunction
) {
  const user = req.user;
  if (!user) return next();

  try {
    console.log(`\n[populateSubscription] ➜ Iniciando para user:${user.id}`);

    const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
    const result = await checkSubscriptionStatus.execute(user.id);
    const subscription = result?.subscription ?? null;

    console.log('[populateSubscription] Resultado do serviço:', {
      found: !!subscription,
      tier: subscription?.tier,
      status: subscription?.status,
      expires_at: subscription?.expires_at,
    });

    // 🔹 Popula os dados da assinatura (ou null se inexistente)
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

    // ✅ Atualiza o cache com o user enriquecido
    await RedisCache.save(`user:${user.id}`, user);
    console.log(`[CACHE UPDATE] user:${user.id} atualizado com assinatura ${subscription ? subscription.tier : 'null'}`);

    return next();
  } catch (error) {
    console.error('[populateSubscription] Erro ao carregar assinatura:', error);
    return next();
  }
}
