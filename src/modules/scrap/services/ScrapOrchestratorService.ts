import { container } from "tsyringe";
import AppDataSource from "@shared/infra/typeorm/data-source";
import { RedisCacheProvider } from "@shared/cache/RedisCacheProvider";
import AppError from "@shared/errors/AppError";

import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import Item from "@modules/item/infra/typeorm/entities/Item";
import UserQuotaService from "@modules/user_quota/services/UserQuotaService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import { SubscriptionTierLimits } from "@modules/subscriptions/enums/subscription-limits.enum";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  async processUrls(
    urls: string[],
    user?: { id: string; tier: SubscriptionTier },
  ): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    const itemRepository = AppDataSource.getRepository(Item);
    const userQuotaService = user ? container.resolve(UserQuotaService) : null;

    if (user && userQuotaService) {
      // ✅ Checa quota antes da raspagem
      await userQuotaService.checkQuota(user.id, user.tier);

      // ⚠ Limite total de itens salvos
      const existingCount = await itemRepository.count({ where: { createdBy: user.id } });
      const maxAllowed = SubscriptionTierLimits[user.tier] ?? SubscriptionTierLimits[SubscriptionTier.FREE];
      if (existingCount >= maxAllowed) {
        throw new AppError(`Limite total de itens atingido para o plano ${user.tier}`, 403);
      }
    }

    for (const url of urls) {
      const cacheKey = `scraped:${url}`;
      let scrapedItem: IScrapedItem | null = await this.cache.get<IScrapedItem>(cacheKey);

      if (scrapedItem) {
        console.log(`[CACHE HIT] ${url}`);
      } else {
        console.log(`[CACHE MISS] Raspando: ${url}`);
        try {
          scrapedItem = await this.scraper.scrape(url);
          await this.cache.set(cacheKey, scrapedItem, 12 * 60 * 60); // 12h TTL

          if (user && userQuotaService) {
            // ✅ Consome quota após cada raspagem
            await userQuotaService.consumeScrape(user.id);
            console.log(`[QUOTA] Consumo registrado para usuário ${user.id}`);
          }

        } catch (err) {
          console.error(`[SCRAPER ERROR] Falha ao raspar ${url}:`, err);
          continue;
        }
      }

      if (user && scrapedItem) {
        try {
          const newItem = itemRepository.create({
            title: scrapedItem.title || "Sem título",
            price: scrapedItem.price && !isNaN(Number(scrapedItem.price)) ? Number(scrapedItem.price) : 0,
            itemLink: scrapedItem.url,
            createdBy: user.id,
          });
          await itemRepository.save(newItem);
        } catch (err) {
          console.error(`[DB ERROR] Falha ao salvar item (${url}) para usuário ${user.id}:`, err);
        }
      }

      if (scrapedItem) results.push(scrapedItem);
    }

    console.log(`✅ Raspagem concluída: ${results.length} itens processados.`);
    return results;
  }
}
