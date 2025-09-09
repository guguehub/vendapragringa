import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';

export default class CheckSubscriptionStatusController {
  public async show(request: Request, response: Response): Promise<Response> {
    // Garantir que o usuário está autenticado
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ message: 'User not authenticated' });
    }

    try {
      // Resolver o serviço via tsyringe
      const checkSubscriptionStatusService = container.resolve(CheckSubscriptionStatusService);

      const subscriptionStatus = await checkSubscriptionStatusService.execute(userId);

      return response.status(200).json(subscriptionStatus);
    } catch (err: any) {
      // Caso algum erro aconteça
      return response.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  }
}
