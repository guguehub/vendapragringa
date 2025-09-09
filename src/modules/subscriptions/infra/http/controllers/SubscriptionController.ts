import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';
import UpgradeSubscriptionService from '@modules/subscriptions/services/UpdateSubscriptionService';
import { CreateSubscriptionDto } from '@modules/subscriptions/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '@modules/subscriptions/dtos/update-subscription.dto';
import { SubscriptionStatus } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

export default class SubscriptionController {
  /**
   * Cria uma nova assinatura
   */
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    if (!userId) {
      throw new AppError('Authenticated user not found', 401);
    }

    const { tier } = request.body as CreateSubscriptionDto;

    const createSubscription = container.resolve(CreateSubscriptionService);

    const subscription = await createSubscription.execute({
      userId,
      tier,
      status: SubscriptionStatus.ACTIVE, // default
    });

    return response.status(201).json(subscription);
  }

  /**
   * Faz upgrade ou downgrade do tier de uma assinatura existente
   */
  public async upgrade(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    if (!userId) {
      throw new AppError('Authenticated user not found', 401);
    }

    const { newTier } = request.body as UpdateSubscriptionDto;

    const upgradeSubscription = container.resolve(UpgradeSubscriptionService);
    await upgradeSubscription.execute({ userId, newTier });

    return response.json({
      message: `Subscription tier updated to "${newTier}" successfully`,
    });
  }
}
