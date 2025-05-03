import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSubscriptionService from '@modules/subscriptions/services/CreateSubscriptionService';

export default class SubscriptionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { userId, tier, status } = request.body;

    const createSubscription = container.resolve(CreateSubscriptionService);

    const subscription = await createSubscription.execute({
      userId,
      tier,
      status,
    });

    return response.status(201).json(subscription);
  }
}
