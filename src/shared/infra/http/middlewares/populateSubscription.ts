// src/shared/infra/http/middlewares/populateSubscription.ts
import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

export default async function populateSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    // Apenas autenticação falhou
    return next(); // não lança erro, deixa a rota decidir
  }

  try {
    const checkSubscriptionStatus = container.resolve(CheckSubscriptionStatusService);
    const result = await checkSubscriptionStatus.execute(req.user.id);

    const subscription = result?.subscription ?? null;

    // Popula a assinatura no req.user, padronizando datas como string
    req.user.subscription = subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          tier: subscription.tier as SubscriptionTier,
          start_date: subscription.start_date?.toISOString() ?? null,
          expires_at: subscription.expires_at?.toISOString() ?? null,
          isTrial: subscription.isTrial,
          cancelled_at: subscription.cancelled_at?.toISOString() ?? null,
          userId: subscription.userId,
          created_at: subscription.created_at.toISOString(),
          updated_at: subscription.updated_at.toISOString(),
        }
      : null;

    return next();
  } catch (error) {
    console.error('[populateSubscription] erro ao carregar assinatura:', error);
    return next(); // não bloqueia a request, só não popula subscription
  }
}
