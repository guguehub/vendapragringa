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

  /** 🔹 Mapper seguro IScrapedItem → Partial<Item> */
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

  /** 🔹 Fluxo híbrido de scraping */
  async processUrls(
    urls: string[],
    user?: { id: string; tier: SubscriptionTier }
  ): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    const itemRepository = AppDataSource.getRepository(Item);
    const userQuotaService = user ? container.resolve(UserQuotaService) : null;

    // 🔹 1. Verificação inicial de saldo e limite
    if (user && userQuotaService) {
      await userQuotaService.checkQuota(user.id, user.tier);

      const existingCount = await itemRepository.count({ where: { createdBy: user.id } });
      const maxAllowed = SubscriptionTierLimits[user.tier] ?? SubscriptionTierLimits[SubscriptionTier.FREE];
      if (existingCount >= maxAllowed) {
        throw new AppError(`Limite total de itens atingido para o plano ${user.tier}`, 403);
      }
    }

    // 🔹 2. Processamento das URLs
    for (const url of urls) {
      const cacheKey = `scraped:${url}`;
      let scrapedItem: IScrapedItem | null = await this.cache.get<IScrapedItem>(cacheKey);

      try {
        // 🔸 Busca cache ou executa scraping
        if (!scrapedItem) {
          scrapedItem = await this.scraper.scrape(url);
          await this.cache.set(cacheKey, scrapedItem, 12 * 60 * 60); // 12h
          console.log(`[SCRAPER] ✅ Raspagem concluída: ${url}`);
        } else {
          console.log(`[CACHE HIT] ${url}`);
        }

        // 🔸 Salva item no banco
        if (scrapedItem) {
          const newItem = itemRepository.create(this.mapScrapedToItem(scrapedItem, user?.id));
          await itemRepository.save(newItem);
          results.push(scrapedItem);
          console.log(`[DB] 💾 Item salvo: ${scrapedItem.title ?? "Sem título"}`);
        }

        // 🔸 Se usuário autenticado → consome saldo (apenas 1x ao fim de sucesso)
        if (user && userQuotaService) {
          await userQuotaService.consumeScrape(user.id);
          console.log(`[QUOTA] 💰 Consumo registrado para ${user.id}`);
        }
      } catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[SCRAPER ERROR] Falha ao processar ${url}:`, message);
  if (user && userQuotaService) {
    await userQuotaService.logScrapeError(user.id, `Falha ao raspar ${url}: ${message}`);
  }
  continue;
}
    }

    console.log(`✅ Raspagem finalizada: ${results.length} item(s) processado(s).`);
    return results;
  }
}
