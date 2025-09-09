import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';

export default class CheckSubscriptionStatusController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const checkSubscriptionStatusService = container.resolve(
      CheckSubscriptionStatusService,
    );

    const subscriptionStatus = await checkSubscriptionStatusService.execute(userId);

    return response.status(200).json(subscriptionStatus);
  }
}
