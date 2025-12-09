import { container } from "tsyringe";
import AppDataSource from "@shared/infra/typeorm/data-source";
import AppError from "@shared/errors/AppError";
import { RedisCacheProvider } from "@shared/cache/RedisCacheProvider";

import { MercadoLivreScraper } from "../infra/scrapy/mercadoLivre.scraper";
import { IScrapedItem } from "../domain/models/IScrapedItem";
import Item from "@modules/item/infra/typeorm/entities/Item";
import UserQuotaService from "@modules/user_quota/services/UserQuotaService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import { SubscriptionTierLimits } from "@modules/subscriptions/enums/subscription-limits.enum";

export class ScrapOrchestratorService {
  private scraper = new MercadoLivreScraper();
  private cache = new RedisCacheProvider();

  /**
   * 🔹 Mapper seguro de IScrapedItem → Partial<Item>
   */
  private mapScrapedToItem(scraped: IScrapedItem, userId?: string): Partial<Item> {
  return {
    title: scraped.title ?? "Sem título",
    description: scraped.description ?? undefined,
    price: scraped.price && !isNaN(Number(scraped.price)) ? Number(scraped.price) : 0,
    itemLink: scraped.url,
    itemStatus: scraped.itemStatus ?? "unknown",
    createdBy: userId ?? "system",
    lastScrapedAt: new Date(),
    importStage: "draft",
    isDraft: true,
    status: "ready",
  };
}


  /**
   * 🔹 Processa uma lista de URLs e retorna IScrapedItem[]
   * @param urls URLs a serem raspadas
   * @param user Opcional: usuário autenticado com ID e Tier
   */
  async processUrls(
    urls: string[],
    user?: { id: string; tier: SubscriptionTier }
  ): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    const itemRepository = AppDataSource.getRepository(Item);
    const userQuotaService = user ? container.resolve(UserQuotaService) : null;

    if (user && userQuotaService) {
      // 🔹 Checa quota de raspagem
      await userQuotaService.checkQuota(user.id, user.tier);

      // 🔹 Checa limite total de itens criados
      const existingCount = await itemRepository.count({ where: { createdBy: user.id } });
      const maxAllowed = SubscriptionTierLimits[user.tier] ?? SubscriptionTierLimits[SubscriptionTier.FREE];
      if (existingCount >= maxAllowed) {
        throw new AppError(`Limite total de itens atingido para o plano ${user.tier}`, 403);
      }
    }

    for (const url of urls) {
      const cacheKey = `scraped:${url}`;
      let scrapedItem: IScrapedItem | null = await this.cache.get<IScrapedItem>(cacheKey);

      if (!scrapedItem) {
        try {
          scrapedItem = await this.scraper.scrape(url);
          await this.cache.set(cacheKey, scrapedItem, 12 * 60 * 60); // 12h
          console.log(`[SCRAPER] Raspagem concluída e cache atualizado: ${url}`);
        } catch (err) {
          console.error(`[SCRAPER ERROR] Falha ao raspar ${url}:`, err);
          continue;
        }
      } else {
        console.log(`[CACHE HIT] ${url}`);
      }

      if (user && scrapedItem && userQuotaService) {
        try {
          // 🔹 Consome 1 raspagem
          await userQuotaService.consumeScrape(user.id);
          console.log(`[QUOTA] Raspagem consumida para usuário ${user.id}`);

          // 🔹 Log saldo atualizado
          const subscriptionCacheKey = `user-subscription-${user.id}`;
          const cachedSub: any = await this.cache.get(subscriptionCacheKey);
          if (cachedSub?.subscription) {
            console.log(`[QUOTA STATUS] userId: ${user.id}, saldo: ${cachedSub.subscription.scrape_balance}, total usados: ${cachedSub.subscription.total_scrapes_used}`);
          }
        } catch (err) {
          console.error(`[QUOTA ERROR] Falha ao consumir quota para ${user.id}:`, err);
        }
      }

      if (scrapedItem) {
        try {
          // 🔹 Criação de Item agnóstico
          const newItem = itemRepository.create(this.mapScrapedToItem(scrapedItem, user?.id));
          await itemRepository.save(newItem);
          console.log(`[DB] Item salvo: ${scrapedItem.title ?? 'Sem título'}`);
        } catch (err) {
          console.error(`[DB ERROR] Falha ao salvar item (${url}):`, err);
        }

        results.push(scrapedItem);
      }
    }

    console.log(`✅ Raspagem concluída: ${results.length} itens processados.`);
    return results;
  }
}
