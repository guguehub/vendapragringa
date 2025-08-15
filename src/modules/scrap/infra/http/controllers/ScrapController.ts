import { Request, Response } from "express";
import { ScrapOrchestratorService } from "../../../services/ScrapOrchestratorService";

export class ScrapController {
  constructor(private scrapOrchestratorService: ScrapOrchestratorService) {}

  async scrapeUrls(req: Request, res: Response): Promise<Response> {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "Nenhuma URL fornecida." });
    }

    const results = await this.scrapOrchestratorService.processUrls(urls, req.user?.id);
    return res.json(results);
  }
}
