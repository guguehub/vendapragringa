import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';
import UpgradeSubscriptionServiceUser from '@modules/subscriptions/services/UpgradeSubscriptionServiceUser';
import UpdateSubscriptionServiceAdmin from '@modules/subscriptions/services/UpdateSubscriptionServiceAdmin';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';

import { CreateSubscriptionDto } from '@modules/subscriptions/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '@modules/subscriptions/dtos/update-subscription.dto';

export default class SubscriptionController {
  /**
   * 🧩 Criação de assinatura (somente admin)
   */
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { userId, tier } = request.body as CreateSubscriptionDto;
      if (!userId) throw new AppError('UserId is required for creating subscription', 400);

      const createService = container.resolve(CreateSubscriptionService);
      const subscription = await createService.execute({ userId, tier });

      // ✅ Atualiza cache após criação
      const checkStatusService = container.resolve(CheckSubscriptionStatusService);
      await checkStatusService.execute(userId);

      return response.status(201).json(subscription);
    } catch (error: any) {
      const message = error instanceof AppError ? error.message : 'Internal server error';
      const status = error instanceof AppError ? error.statusCode : 500;
      return response.status(status).json({ error: message });
    }
  }

  /**
   * ⚙️ Upgrade / downgrade da assinatura do usuário autenticado
   */
  public async upgrade(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user?.id;
      if (!userId) throw new AppError('Authenticated user not found', 401);

      const { tier } = request.body as UpdateSubscriptionDto;
      if (!tier) throw new AppError('Tier is required for upgrade', 400);

      const upgradeService = container.resolve(UpgradeSubscriptionServiceUser);
      const subscription = await upgradeService.execute({ userId, tier });

      // ✅ Revalida assinatura e atualiza caches
      const checkStatusService = container.resolve(CheckSubscriptionStatusService);
      const subscriptionStatus = await checkStatusService.execute(userId);

      return response.json({
        message: `Subscription tier updated to "${subscription.tier}" successfully`,
        subscription: subscriptionStatus.subscription,
      });
    } catch (error: any) {
      const message = error instanceof AppError ? error.message : 'Internal server error';
      const status = error instanceof AppError ? error.statusCode : 500;
      return response.status(status).json({ error: message });
    }
  }

  /**
   * 🔧 Atualização manual (somente admin)
   */
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { subscriptionId, tier, status, expires_at, isTrial, cancelled_at, scrape_balance } =
        request.body as UpdateSubscriptionDto;

      if (!subscriptionId) throw new AppError('subscriptionId is required for update', 400);

      const updateService = container.resolve(UpdateSubscriptionServiceAdmin);
      const updatedSubscription = await updateService.execute({
        subscriptionId,
        tier,
        status,
        expires_at,
        isTrial,
        cancelled_at,
        scrape_balance,
      });

      // ✅ Revalida assinatura e atualiza caches
      const checkStatusService = container.resolve(CheckSubscriptionStatusService);
      const subscriptionStatus = await checkStatusService.execute(updatedSubscription.userId);

      return response.json({
        message: 'Subscription updated successfully',
        subscription: subscriptionStatus.subscription,
      });
    } catch (error: any) {
      const message = error instanceof AppError ? error.message : 'Internal server error';
      const status = error instanceof AppError ? error.statusCode : 500;
      return response.status(status).json({ error: message });
    }
  }
}
