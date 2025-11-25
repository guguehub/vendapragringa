// src/modules/scrap/infra/http/routes/scrap.routes.ts
import { Router } from 'express';
import { ScrapController } from '../controllers/ScrapController';
import identifyUser from '@shared/infra/http/middlewares/identifyUser';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import populateSubscription from '@shared/infra/http/middlewares/populateSubscription';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';
import { ScrapOrchestratorService } from '@modules/scrap/services/ScrapOrchestratorService';

const scrapRoutes = Router();
const scrapController = new ScrapController();
const orchestrator = new ScrapOrchestratorService();

/**
 * ✅ Diagnóstico / Health-check
 */
scrapRoutes.get(
  '/',
  identifyUser,
  isAuthenticated,
  populateSubscription,
  async (req, res) => {
    return res.status(200).json({
      message: '✅ Scrap API ativa e operacional',
      user: req.user?.id || null,
      subscription: req.user?.subscription?.tier || 'none',
      scrape_balance: req.user?.subscription?.scrape_balance ?? 0,
    });
  },
);

/**
 * 🧩 Raspagem anônima (única)
 */
scrapRoutes.get('/once', async (req, res) => {
  if ((req as any).session?.scrapedOnce) {
    return res.status(403).json({
      message: 'Você já utilizou sua raspagem gratuita. Faça login para salvar e continuar.',
    });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  (req as any).session.scrapedOnce = true;

  try {
    const result = await orchestrator.processUrls([url]);
    console.log(`[SCRAPER][ONCE] ${url} -> ${result[0]?.title || 'sem título'}`);
    return res.json(result[0]);
  } catch (err: any) {
    console.error('[SCRAPER][ERRO]', err);
    return res.status(500).json({ error: err.message || 'Erro ao processar URL' });
  }
});

/**
 * 🔐 Rota autenticada — raspagem completa e registro no banco
 */
scrapRoutes.post(
  '/',
  identifyUser,
  isAuthenticated,
  populateSubscription,
  CheckUserItemLimitMiddleware,
  async (req, res) => {
    try {
      const result = await scrapController.scrapeUrls(req, res);
      // resposta com detalhes
      return res.json({
        message: '✅ Raspagem realizada com sucesso',
        user: req.user?.id,
        tier: req.user?.subscription?.tier,
        saldo_atual: req.user?.subscription?.scrape_balance,
        items: result,
      });
    } catch (err: any) {
      console.error('[SCRAP][ERRO]', err);
      return res.status(500).json({ error: err.message || 'Erro ao processar raspagem' });
    }
  },
);

export default scrapRoutes;
