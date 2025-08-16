import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import { RedisCacheProvider } from "@shared/cache/RedisCacheProvider";
import AppDataSource from "@shared/infra/typeorm/data-source";
import Item from "@modules/item/infra/typeorm/entities/Item";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  /**
   * Processa uma ou mais URLs.
   * - Se `userId` for fornecido → salva no banco e aplica limites via middleware.
   * - Se anônimo → apenas retorna resultado (sem salvar no banco).
   */
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

      // Se usuário está logado → salva no banco
      if (userId) {
        try {
          const itemRepository = AppDataSource.getRepository(Item);

          await itemRepository.save(
            itemRepository.create({
              title: item.title,
              price: item.price,
              url: item.url,
              user: { id: userId },
            })
          );

          console.log(`[DB SAVE] Item salvo para o usuário: ${userId}`);
        } catch (err) {
          console.error(
            `[DB ERROR] Erro ao salvar item para usuário ${userId}:`,
            err
          );
        }
      }

      results.push(item);
    }

    return results;
  }
}
