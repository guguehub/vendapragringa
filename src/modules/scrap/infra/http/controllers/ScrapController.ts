import { Request, Response } from "express";
import { ScrapOrchestratorService } from "../../../services/ScrapOrchestratorService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";

export class ScrapController {
  constructor(private scrapOrchestratorService: ScrapOrchestratorService) {}

  async scrapeUrls(req: Request, res: Response): Promise<Response> {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "Nenhuma URL fornecida." });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const userTier = req.user.subscription?.tier ?? "free";

    const limits: Record<SubscriptionTier | "free", number> = {
      free: 5,
      [SubscriptionTier.BRONZE]: 10,
      [SubscriptionTier.SILVER]: 20,
      [SubscriptionTier.GOLD]: 50,
      [SubscriptionTier.INFINITY]: Infinity,
    };

    const maxUrls = limits[userTier as SubscriptionTier | "free"];

    if (urls.length > maxUrls) {
      return res.status(400).json({
        error: `Seu plano permite processar no máximo ${maxUrls} URLs por vez.`,
      });
    }

    const results = await this.scrapOrchestratorService.processUrls(urls, {
  id: req.user!.id,
  tier: req.user!.subscription?.tier ?? SubscriptionTier.FREE,
});


    return res.json(results);
  }
}
