import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";

export class ScrapOrchestratorService {
  private scraper: MercadoLivreScraper;

  constructor() {
    this.scraper = new MercadoLivreScraper();
  }

  async processUrls(urls: string[], userId?: string): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];

    for (const url of urls) {
      // Futuro: checar cache, banco e vincular ao usuário
      const item = await this.scraper.scrape(url);
      results.push(item);
    }

    return results;
  }
}
