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
 *
 * - Garante autenticação
 * - Carrega o usuário e sua assinatura atual
 * - Mostra o saldo de raspagens disponíveis
 */
scrapRoutes.get(
  '/',
  isAuthenticated,
  identifyUser, // 1️⃣ Decodifica o token JWT e anexa req.user
  populateSubscription, // 2️⃣ Popula assinatura e sincroniza quota com Redis
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
 * 🧩 Raspagem anônima (sem login)
 * Permite apenas uma raspagem por sessão (para demonstração gratuita).
 */
scrapRoutes.get('/once', async (req, res) => {
  const session = (req as any).session;

  if (session?.scrapedOnce) {
    return res.status(403).json({
      message:
        'Você já utilizou sua raspagem gratuita. Faça login para continuar.',
    });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório." });
  }

  session.scrapedOnce = true;

  try {
    const result = await orchestrator.processUrls([url]);
    console.log(`[SCRAPER][ONCE] ${url} → ${result[0]?.title || 'sem título'}`);
    return res.json(result[0]);
  } catch (err: any) {
    console.error('[SCRAPER][ERRO]', err);
    return res
      .status(500)
      .json({ error: err.message || 'Erro ao processar a URL.' });
  }
});

/**
 * 🔐 Rota autenticada — raspagem completa e registro no banco.
 *
 * Esta rota realiza a raspagem *com login*, respeitando:
 *  - O tier da assinatura (via subscription.tier)
 *  - O saldo de quota (`scrape_balance`)
 *  - O limite de itens por usuário (`CheckUserItemLimitMiddleware`)
 *
 * O controller (`ScrapController`) é responsável por:
 *  - Validar URLs
 *  - Verificar e consumir saldo de quota
 *  - Executar a raspagem via `ScrapOrchestratorService`
 *  - Registrar logs e atualizar caches
 */
scrapRoutes.post(
  '/',
  isAuthenticated, // 1️⃣ Garante que o token JWT é válido
  identifyUser, // 2️⃣ Adiciona req.user.id (decodificado do token)
  populateSubscription, // 3️⃣ Popula assinatura + sincroniza saldo/quotas
  CheckUserItemLimitMiddleware, // 4️⃣ Verifica se o usuário não excedeu o limite de itens
  async (req, res) => {
    try {
      // Controller centraliza a orquestração da raspagem
      return await scrapController.scrapeUrls(req, res);
    } catch (err: any) {
      console.error('[SCRAP][ERRO]', err);
      return res
        .status(500)
        .json({ error: err.message || 'Erro ao processar raspagem.' });
    }
  },
);

export default scrapRoutes;
