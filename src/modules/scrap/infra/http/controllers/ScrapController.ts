import { Request, Response } from "express";
import { container } from "tsyringe";
import { ScrapOrchestratorService } from "../../../services/ScrapOrchestratorService";
import UserQuotaService from "@modules/user_quota/services/UserQuotaService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import AppError from "@shared/errors/AppError";

export class ScrapController {
  public async scrapeUrls(req: Request, res: Response): Promise<Response> {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      throw new AppError("Nenhuma URL fornecida.", 400);
    }

    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const user = req.user!;
    const userTier: SubscriptionTier = user.subscription?.tier ?? SubscriptionTier.FREE;

    const limits: Record<SubscriptionTier, number> = {
      [SubscriptionTier.FREE]: 5,
      [SubscriptionTier.BRONZE]: 10,
      [SubscriptionTier.SILVER]: 20,
      [SubscriptionTier.GOLD]: 50,
      [SubscriptionTier.INFINITY]: Infinity,
    };

    const maxUrls = limits[userTier];
    if (urls.length > maxUrls) {
      throw new AppError(`Seu plano permite processar no máximo ${maxUrls} URLs por vez.`, 400);
    }

    const userQuotaService = container.resolve(UserQuotaService);
    const scrapOrchestratorService = container.resolve(ScrapOrchestratorService);

    try {
      await userQuotaService.checkQuota(user.id, userTier);
      const results = await scrapOrchestratorService.processUrls(urls, {
        id: user.id,
        tier: userTier,
      });

      return res.json(results);
    } catch (error) {
      console.error("❌ Erro durante raspagem:", error);
      throw new AppError("Falha durante o processo de raspagem.", 500);
    }
  }
}
