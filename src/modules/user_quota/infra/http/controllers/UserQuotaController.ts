// src/modules/user_quota/infra/http/controllers/UserQuotaController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

export default class UserQuotaController {
  private service: UserQuotaService;

  constructor() {
    this.service = container.resolve(UserQuotaService);
  }

  public async checkQuota(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const tier: SubscriptionTier | undefined = req.user?.subscription?.tier;

    if (!userId || tier === undefined) {
      return res.status(401).json({ message: 'Usuário não autenticado ou assinatura não encontrada.' });
    }

    try {
      const allowed = await this.service.checkQuota(userId, tier);
      return res.status(200).json({ allowed, tier });
    } catch (err: any) {
      return res.status(err.statusCode || 400).json({ message: err.message });
    }
  }

  public async consume(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado.' });

    try {
      await this.service.consumeScrape(userId);
      console.log(`[QuotaController] ✅ Quota consumida para user ${userId}`);
      return res.status(200).json({ message: 'Quota consumida com sucesso.' });
    } catch (err: any) {
      return res.status(err.statusCode || 400).json({ message: err.message });
    }
  }

  public async resetBonus(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { amount } = req.body;

    if (!userId || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Parâmetros inválidos.' });
    }

    try {
      await this.service.resetBonus(userId, amount);
      return res.status(200).json({ message: 'Daily bonus resetado com sucesso.' });
    } catch (err: any) {
      return res.status(err.statusCode || 400).json({ message: err.message });
    }
  }
}
