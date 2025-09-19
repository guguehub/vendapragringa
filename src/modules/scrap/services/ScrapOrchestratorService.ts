import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import { RedisCacheProvider } from "@shared/cache/RedisCacheProvider";
import AppDataSource from "@shared/infra/typeorm/data-source";
import Item from "@modules/item/infra/typeorm/entities/Item";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  // Limites de raspagem por tier
  private readonly LIMITS: Record<string, number> = {
    free: 3,
    bronze: 10,
    silver: 20,
    gold: 50,
  };

  async processUrls(urls: string[], user?: { id: string; tier: string }): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];

    // --- verifica limite antes de iniciar ---
    if (user) {
      const itemRepo = AppDataSource.getRepository(Item);
      const count = await itemRepo.count({ where: { createdBy: user.id } });
      const max = this.LIMITS[user.tier] || this.LIMITS.free;

      if (count >= max) {
        throw new Error(`Limite de raspagem atingido para usuários ${user.tier}`);
      }
    }

    for (const url of urls) {
      const cacheKey = `scraped:${url}`;
      let item: IScrapedItem | null = await this.cache.get<IScrapedItem>(cacheKey);

      if (item) {
        console.log(`[CACHE HIT] URL já raspada: ${url}`);
      } else {
        console.log(`[CACHE MISS] Raspando URL: ${url}`);
        item = await this.scraper.scrape(url);
        await this.cache.set(cacheKey, item, 12 * 60 * 60); // 12h TTL
      }

      if (user) {
        try {
          const itemRepository = AppDataSource.getRepository(Item);

          // Cria e salva item com fields válidos
          const newItem = itemRepository.create({
  title: item.title || "Sem título",
  price: item.price && !isNaN(Number(item.price)) ? Number(item.price) : 0,
  itemLink: item.url,
  createdBy: user.id,
});

          await itemRepository.save(newItem);
          console.log(`[DB SAVE] Item salvo para o usuário: ${user.id}`);
        } catch (err) {
          console.error(`[DB ERROR] Erro ao salvar item para usuário ${user.id}:`, err);
        }
      }

      results.push(item);
    }

    return results;
  }
}
