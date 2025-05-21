import { Request, Response } from 'express';
//import UpgradeSubscriptionService from '@modules/subscriptions/services/UpgradeSubscriptionService';
import UpgradeSubscriptionService from './UpdateSubscriptionService';
import { container } from 'tsyringe';

export default class SubscriptionController {
  public async upgrade(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { newTier } = req.body;

    const upgradeSubscription = container.resolve(UpgradeSubscriptionService);

    const updatedSubscription = await upgradeSubscription.execute({
      userId,
      newTier,
    });

    return res.json(updatedSubscription);
  }
}
