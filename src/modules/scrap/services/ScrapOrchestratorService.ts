import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import { RedisCacheProvider } from "@shared/cache/RedisCacheProvider";
import AppDataSource from "@shared/infra/typeorm/data-source";
import Item from "@modules/item/infra/typeorm/entities/Item";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import { SubscriptionTierLimits } from "@modules/subscriptions/enums/subscription-limits.enum";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  async processUrls(
    urls: string[],
    user?: { id: string; tier: SubscriptionTier }
  ): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];

    if (user) {
      const itemRepo = AppDataSource.getRepository(Item);
      const count = await itemRepo.count({ where: { createdBy: user.id } });

      // Pega o limite diretamente do SubscriptionTierLimits
      const max = SubscriptionTierLimits[user.tier] ?? SubscriptionTierLimits.free;

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
          const newItem = itemRepository.create({
            title: item.title || "Sem título",
            price: item.price && !isNaN(Number(item.price)) ? Number(item.price) : 0,
            itemLink: item.url,
            createdBy: user.id,
          });
          await itemRepository.save(newItem);
        } catch (err) {
          console.error(`[DB ERROR] Erro ao salvar item para usuário ${user.id}:`, err);
        }
      }

      results.push(item);
    }

    return results;
  }
}
