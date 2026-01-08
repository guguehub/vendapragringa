import { Request, Response } from "express";
import { container } from "tsyringe";
import { ScrapOrchestratorService } from "@modules/scrap/services/ScrapOrchestratorService";
import UserQuotaService from "@modules/user_quota/services/UserQuotaService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import AppError from "@shared/errors/AppError";

export class ScrapController {
  public async scrapeUrls(req: Request, res: Response): Promise<Response> {
    // 🔹 Aceita URLs no corpo ou na query string
    let urls: string[] = [];

    if (Array.isArray(req.body?.urls)) {
      urls = req.body.urls;
    } else if (typeof req.query?.url === "string") {
      urls = [req.query.url];
    } else if (Array.isArray(req.query?.url)) {
      urls = (req.query.url as string[]).map(String);
    }

    // 🧩 Validação
    if (!urls.length) throw new AppError("Nenhuma URL fornecida.", 400);
    if (!req.user) throw new AppError("Usuário não autenticado.", 401);

    const user = req.user!;
    const userId = user.id;
    const userTier: SubscriptionTier = user.subscription?.tier ?? SubscriptionTier.FREE;

    // 🔹 Limite de URLs por plano
    const limits: Record<SubscriptionTier, number> = {
      [SubscriptionTier.FREE]: 5,
      [SubscriptionTier.BRONZE]: 10,
      [SubscriptionTier.SILVER]: 20,
      [SubscriptionTier.GOLD]: 50,
      [SubscriptionTier.INFINITY]: Infinity,
    };

    if (urls.length > limits[userTier]) {
      throw new AppError(
        `Seu plano permite processar no máximo ${limits[userTier]} URLs por vez.`,
        400
      );
    }

    const quotaService = container.resolve(UserQuotaService);
    const orchestrator = container.resolve(ScrapOrchestratorService);

    try {
      // 1️⃣ Buscar saldo atual
      const quotaBefore = await quotaService.getUserQuota(userId);
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`[SCRAP][START] 🚀 Iniciando raspagem para user:${userId}`);
      console.table({
        plano: userTier,
        saldo_anterior: quotaBefore.scrape_balance,
        bonus_disponivel: quotaBefore.daily_bonus_count,
        total_usados: quotaBefore.scrape_count,
      });

      // 2️⃣ Checar quota (pré-verificação sem consumo)
      await quotaService.checkQuota(userId, userTier);

      // 3️⃣ Executar orquestração híbrida (consome internamente 1x por sucesso)
      const results = await orchestrator.processUrls(urls, { id: userId, tier: userTier });

      // 4️⃣ Buscar saldo atualizado (após execução)
      const quotaAfter = await quotaService.getUserQuota(userId);
      console.log(`[SCRAP][DONE] ✅ Raspagem concluída para user:${userId}`);
      console.table({
        plano: userTier,
        urls_processadas: urls.length,
        saldo_anterior: quotaBefore.scrape_balance,
        saldo_atual: quotaAfter.scrape_balance,
        total_usados: quotaAfter.scrape_count,
      });
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      // 5️⃣ Retornar resposta resumida
      return res.status(200).json({
        message: "✅ Raspagem concluída com sucesso",
        user: userId,
        tier: userTier,
        urls_enviadas: urls,
        saldo_anterior: quotaBefore.scrape_balance,
        saldo_atual: quotaAfter.scrape_balance,
        total_usados: quotaAfter.scrape_count,
        total_itens: results.length,
        results,
      });
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : "Falha durante o processo de raspagem.";
      const status = error instanceof AppError ? error.statusCode : 500;

      console.error("[SCRAP][ERRO] ❌", error);
      return res.status(status).json({ error: message });
    }
  }
}
