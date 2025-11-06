import { Router } from "express";
import { ScrapController } from "../controllers/ScrapController";
import identifyUser from "@shared/infra/http/middlewares/identifyUser";
import isAuthenticated from "@shared/infra/http/middlewares/isAuthenticated";
import populateSubscription from "@shared/infra/http/middlewares/populateSubscription";
import { CheckUserItemLimitMiddleware } from "@shared/infra/http/middlewares/CheckUserItemLimitMiddleware";
import { ScrapOrchestratorService } from "@modules/scrap/services/ScrapOrchestratorService";

const scrapRoutes = Router();
const scrapController = new ScrapController();
const orchestrator = new ScrapOrchestratorService();

// 📌 Rota de raspagem anônima (1x por sessão, não salva no banco)
scrapRoutes.get("/once", async (req, res) => {
  if ((req as any).session?.scrapedOnce) {
    return res.status(403).json({
      message: "Você já utilizou sua raspagem gratuita. Faça login para salvar e continuar.",
    });
  }

  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  (req as any).session.scrapedOnce = true;

  try {
    const result = await orchestrator.processUrls([url]);
    return res.json(result[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Erro ao processar URL" });
  }
});

// 📌 Rota autenticada (usa controller completo)
scrapRoutes.post(
  "/",
  identifyUser,
  isAuthenticated,
  populateSubscription,
  CheckUserItemLimitMiddleware,
  (req, res) => scrapController.scrapeUrls(req, res)
);

export default scrapRoutes;
