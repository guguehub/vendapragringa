import { Router } from 'express';
import { ScrapOrchestratorService } from '@modules/scrap/services/ScrapOrchestratorService';
import identifyUser from '@shared/infra/http/middlewares/identifyUser';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';

const scrapRoutes = Router();
const orchestrator = new ScrapOrchestratorService();

// 📌 Rota de raspagem anônima (1x por sessão, não salva no banco)
scrapRoutes.get('/once', (req, res) => {
  if ((req as any).session?.scrapedOnce) {
    return res.status(403).json({
      message:
        'Você já utilizou sua raspagem gratuita. Faça login para salvar e continuar.',
    });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  (req as any).session.scrapedOnce = true;

  orchestrator
    .processUrls([url])
    .then((result) => res.json(result[0]))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Erro ao processar URL' }),
    );
});

// 📌 Rota de raspagem logado (salva no banco e respeita limite por tier)
scrapRoutes.get(
  '/',
  identifyUser,
  isAuthenticated,
  CheckUserItemLimitMiddleware,
  async (req, res) => {
    const { url } = req.query;
    const userId = (req as any).user?.id;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
    }

    try {
      const result = await orchestrator.processUrls([url], userId);
      return res.json(result[0]);
    } catch (err: any) {
      return res
        .status(500)
        .json({ error: err.message || 'Erro ao processar URL' });
    }
  },
);

export default scrapRoutes ;
