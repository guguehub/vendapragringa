// src/modules/subscriptions/infra/http/controllers/SubscriptionController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';
import UpgradeSubscriptionServiceUser from '@modules/subscriptions/services/UpgradeSubscriptionServiceUser';
import UpdateSubscriptionServiceAdmin from '@modules/subscriptions/services/UpdateSubscriptionServiceAdmin';

import { CreateSubscriptionDto } from '@modules/subscriptions/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '@modules/subscriptions/dtos/update-subscription.dto';
import { SubscriptionStatus } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

export default class SubscriptionController {
  /**
   * Cria uma nova assinatura (somente admin)
   */
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { userId, tier } = request.body as CreateSubscriptionDto;

      if (!userId) {
        throw new AppError('UserId is required for creating subscription', 400);
      }

      const createService = container.resolve(CreateSubscriptionService);

      const subscription = await createService.execute({
        userId,
        tier,
        status: SubscriptionStatus.ACTIVE,
      });

      return response.status(201).json(subscription);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Upgrade ou downgrade de tier da assinatura do usuário logado
   */
  public async upgrade(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new AppError('Authenticated user not found', 401);
      }

      const { tier } = request.body as UpdateSubscriptionDto;
      console.log('BODY RECEBIDO EM UPGRADE:', request.body);

      if (!tier) {
        throw new AppError('Tier is required for upgrade', 400);
      }

      const upgradeService = container.resolve(UpgradeSubscriptionServiceUser);
      const subscription = await upgradeService.execute({ userId, tier });

      return response.json({
        message: `Subscription tier updated to "${tier}" successfully`,
        subscription,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update geral da assinatura (somente admin)
   */
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { subscriptionId, tier, status, expires_at } = request.body as UpdateSubscriptionDto;

      if (!subscriptionId) {
        throw new AppError('subscriptionId is required for update', 400);
      }

      const updateService = container.resolve(UpdateSubscriptionServiceAdmin);
      const subscription = await updateService.execute({
        subscriptionId,
        tier,
        status,
        expires_at,
      });

      return response.json({
        message: 'Subscription updated successfully',
        subscription,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
