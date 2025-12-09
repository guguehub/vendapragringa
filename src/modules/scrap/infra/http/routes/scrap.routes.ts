// src/modules/scrap/infra/http/routes/scrap.routes.ts

import { Router } from 'express';
import { ScrapController } from '../controllers/ScrapController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import identifyUser from '@shared/infra/http/middlewares/identifyUser';
import populateSubscription from '@shared/infra/http/middlewares/populateSubscription';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';
import { ScrapOrchestratorService } from '@modules/scrap/services/ScrapOrchestratorService';

const scrapRoutes = Router();
const scrapController = new ScrapController();
const orchestrator = new ScrapOrchestratorService();

/**
 * ✅ Diagnóstico / Health-check
 * Retorna informações básicas sobre o usuário logado e o estado da API.
 */
scrapRoutes.get(
  '/',
  isAuthenticated,
  identifyUser,
  populateSubscription,
  async (req, res) => {
    return res.status(200).json({
      message: '✅ Scrap API ativa e operacional',
      user: req.user?.id || null,
      subscription: req.user?.subscription?.tier || 'none',
      scrape_balance: req.user?.quota?.scrape_balance ?? 0,
    });
  },
);

/**
 * 🧩 Raspagem anônima (sem login)
 * Permite uma única raspagem por sessão.
 */
scrapRoutes.get('/once', async (req, res) => {
  const session = (req as any).session;

  if (session?.scrapedOnce) {
    return res.status(403).json({
      message:
        'Você já utilizou sua raspagem gratuita. Faça login para salvar e continuar.',
    });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  session.scrapedOnce = true;

  try {
    const result = await orchestrator.processUrls([url]);
    console.log(`[SCRAPER][ONCE] ${url} -> ${result[0]?.title || 'sem título'}`);
    return res.json(result[0]);
  } catch (err: any) {
    console.error('[SCRAPER][ERRO]', err);
    return res
      .status(500)
      .json({ error: err.message || 'Erro ao processar URL' });
  }
});

/**
 * 🔐 Rota autenticada — raspagem completa e registro no banco.
 * Requer assinatura e respeita limites de quota e tier.
 */
scrapRoutes.post(
  '/',
  isAuthenticated,
  identifyUser,
  populateSubscription,
  CheckUserItemLimitMiddleware,
  async (req, res) => {
    try {
      // ✅ O controller já retorna a resposta JSON formatada.
      return await scrapController.scrapeUrls(req, res);
    } catch (err: any) {
      console.error('[SCRAP][ERRO]', err);
      return res
        .status(500)
        .json({ error: err.message || 'Erro ao processar raspagem' });
    }
  },
);

export default scrapRoutes;
