// src/modules/subscriptions/infra/http/controllers/SubscriptionController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';
import UpdateSubscriptionService from '@modules/subscriptions/services/UpdateSubscriptionService';

import { CreateSubscriptionDto } from '@modules/subscriptions/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '@modules/subscriptions/dtos/update-subscription.dto';

import { SubscriptionStatus } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

export default class SubscriptionController {
  /**
   * Cria uma nova assinatura para o usuário autenticado
   */
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new AppError('Authenticated user not found', 401);
      }

      const { tier } = request.body as CreateSubscriptionDto;

      const createSubscription = container.resolve(CreateSubscriptionService);

      const subscription = await createSubscription.execute({
        userId,
        tier,
        status: SubscriptionStatus.ACTIVE, // default para novas assinaturas
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
   * Atualiza (upgrade/downgrade) o tier de uma assinatura existente
   */
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new AppError('Authenticated user not found', 401);
      }

      const { newTier } = request.body as UpdateSubscriptionDto;

      const updateSubscription = container.resolve(UpdateSubscriptionService);

      const updatedSubscription = await updateSubscription.execute({
        userId,
        newTier,
      });

      return response.json({
        message: `Subscription tier updated to "${newTier}" successfully`,
        subscription: updatedSubscription,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
