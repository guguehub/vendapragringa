import { Router } from "express";
import { ScrapDevController } from "../controllers/ScrapDevController";

const scrapDevRoutes = Router();
const scrapDevController = new ScrapDevController();

/**
 * ✅ Rota: Resetar flag de raspagem única (anônima)
 * Exemplo: POST /scrap-dev/reset-once
 */
scrapDevRoutes.post("/reset-once", (req, res) => scrapDevController.resetOnce(req, res));

/**
 * ✅ Rota: Resetar cotas de raspagem do usuário (modo dev)
 * Exemplo: POST /scrap-dev/reset-scrap
 */
scrapDevRoutes.post("/reset-scrap", (req, res) => scrapDevController.resetScrap(req, res));

export default scrapDevRoutes;
