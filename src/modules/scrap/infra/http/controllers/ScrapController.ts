import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ScrapOrchestratorService } from '@modules/scrap/services/ScrapOrchestratorService';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import AppError from '@shared/errors/AppError';

export class ScrapController {
  public async scrapeUrls(req: Request, res: Response): Promise<Response> {
    // 🔹 Aceita URLs no corpo ou na query string
    let urls: string[] = [];

    if (Array.isArray(req.body?.urls)) {
      urls = req.body.urls;
    } else if (typeof req.query?.url === 'string') {
      urls = [req.query.url];
    } else if (Array.isArray(req.query?.url)) {
      urls = (req.query.url as string[]).map(u => String(u));
    }

    // 🧩 Validação
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new AppError('Nenhuma URL fornecida.', 400);
    }

    if (!req.user) {
      throw new AppError('Usuário não autenticado.', 401);
    }

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

    const maxUrls = limits[userTier];
    if (urls.length > maxUrls) {
      throw new AppError(
        `Seu plano permite processar no máximo ${maxUrls} URLs por vez.`,
        400,
      );
    }

    const quotaService = container.resolve(UserQuotaService);
    const orchestrator = container.resolve(ScrapOrchestratorService);

    try {
      // 1️⃣ Buscar saldo atual
      const quotaBefore = await quotaService.getUserQuota(userId);

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`[SCRAP][START] 🚀 Iniciando raspagem para user:${userId}`);
      console.table({
        plano: userTier,
        saldo_anterior: quotaBefore.scrape_balance,
        bonus_disponivel: quotaBefore.daily_bonus_count,
        total_usados: quotaBefore.scrape_count,
      });

      // 2️⃣ Verificar quota disponível
      await quotaService.checkQuota(userId, userTier);

      // 3️⃣ Executar raspagem
      const results = await orchestrator.processUrls(urls, {
        id: userId,
        tier: userTier,
      });

      // 4️⃣ Consumir quota (1 por requisição, ou N por URL)
      const unitsToConsume = urls.length;
      await quotaService.consume(userId, unitsToConsume);

      // 5️⃣ Buscar saldo atualizado
      const quotaAfter = await quotaService.getUserQuota(userId);

      console.log(`[SCRAP][DONE] ✅ Raspagem concluída para user:${userId}`);
      console.table({
        plano: userTier,
        urls_processadas: urls.length,
        saldo_anterior: quotaBefore.scrape_balance,
        saldo_atual: quotaAfter.scrape_balance,
        total_consumido: quotaBefore.scrape_balance - quotaAfter.scrape_balance,
        total_usados: quotaAfter.scrape_count,
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // 6️⃣ Retornar resposta detalhada
      return res.status(200).json({
        message: '✅ Raspagem concluída com sucesso',
        user: userId,
        tier: userTier,
        urls_enviadas: urls,
        saldo_anterior: quotaBefore.scrape_balance,
        saldo_atual: quotaAfter.scrape_balance,
        total_consumido: quotaBefore.scrape_balance - quotaAfter.scrape_balance,
        total_usados: quotaAfter.scrape_count,
        total_itens: results.length,
        results,
      });
    } catch (error: any) {
      console.error('[SCRAP][ERRO] ❌', error);

      const status = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError ? error.message : 'Falha durante o processo de raspagem.';

      return res.status(status).json({ error: message });
    }
  }
}
