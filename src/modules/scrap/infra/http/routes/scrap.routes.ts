import { Router } from "express";
import { ScrapOrchestratorService } from "@modules/scrap/services/ScrapOrchestratorService";

const scrapRoutes = Router();
const orchestrator = new ScrapOrchestratorService();

scrapRoutes.get("/", async (req, res) => {
  const { url } = req.query;
  const userId = (req as any).user?.id; // futuramente será preenchido pelo middleware de auth

  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });

  try {
    const result = await orchestrator.processUrls([url], userId);
    return res.json(result[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Erro ao processar URL" });
  }
});

export { scrapRoutes };
