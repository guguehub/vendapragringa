import { Router } from "express";
import { MercadoLivreScraper } from "../../scrapy/mercadoLivre.scraper";

const scrapRoutes = Router();
const scraper = new MercadoLivreScraper();

scrapRoutes.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Parâmetro 'url' é obrigatório" });
  }

  const result = await scraper.scrape(url);
  return res.json(result);
});

export { scrapRoutes };
