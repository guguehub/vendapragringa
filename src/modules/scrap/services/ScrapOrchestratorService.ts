import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import { RedisCacheProvider } from "@shared/infra/cache/RedisCacheProvider";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  // Aqui poderia receber req.user.id futuramente para tiers
  async processUrls(urls: string[], userId?: string): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];

    for (const url of urls) {
      const cacheKey = `scraped:${url}`;
      let item: IScrapedItem | null = await this.cache.get<IScrapedItem>(cacheKey);

      if (item) {
        console.log(`[CACHE HIT] URL já raspada: ${url}`);
      } else {
        console.log(`[CACHE MISS] Raspando URL: ${url}`);
        item = await this.scraper.scrape(url);

        // Salva no cache com TTL 12h
        await this.cache.set(cacheKey, item, 12 * 60 * 60);
      }

      // Aqui futuramente checaria o tier do userId e aplicaria limites
      // ex: if (userExceededLimit(userId)) throw new Error("Limite de raspagem atingido");

      results.push(item);
    }

    return results;
  }
}
