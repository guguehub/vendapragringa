import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import IUserQuotaRepository from "../domain/repositories/IUserQuotaRepository";
import UserQuota from "../infra/typeorm/entities/UserQuota";

import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";
import { SubscriptionTierScrapeLimits } from "@modules/subscriptions/enums/subscription-tier-scrape-limits.enum";
import { SubscriptionTierLimits } from "@modules/subscriptions/enums/subscription-limits.enum";

import CreateItemScrapeLogService from "@modules/item_scrape_log/services/CreateItemScrapeLogService";
import { ItemScrapeAction } from "@modules/item_scrape_log/enums/item-scrape-action.enum";

import RedisCache from "@shared/cache/RedisCache";

// 🎨 Cores ANSI para logs visuais
const color = {
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  cyan: (msg: string) => `\x1b[36m${msg}\x1b[0m`,
};

@injectable()
export default class UserQuotaService {
  constructor(
    @inject("UserQuotasRepository")
    private userQuotaRepository: IUserQuotaRepository,

    @inject(CreateItemScrapeLogService)
    private createItemScrapeLogService: CreateItemScrapeLogService
  ) {}

  public async consumeItemSlot(userId: string): Promise<void> {
    const quota = await this.userQuotaRepository.findByUserId(userId);

    if (!quota) {
      throw new AppError('Quota do usuário não encontrada', 404);
    }

    if (quota.item_limit <= 0) {
      throw new AppError('Limite de itens atingido', 403);
    }

    quota.item_limit -= 1;

    await this.userQuotaRepository.save(quota);

    console.log(`[UserQuotaService] 💾 Slot de item consumido para user:${userId} | restante:${quota.item_limit}`);
  }

  /** 🔹 Busca ou cria quota do usuário */
  public async getUserQuota(user_id: string): Promise<UserQuota> {
    let quota = await this.userQuotaRepository.findByUserId(user_id);

    if (!quota) {
      quota = await this.userQuotaRepository.create({
        user_id,
        scrape_balance: 0,
        daily_bonus_count: 0,
        scrape_count: 0,
        item_limit: 0,
      });
      await this.userQuotaRepository.save(quota);
    }

    return quota;
  }

  /** 🔹 Checa se o usuário ainda tem raspagens disponíveis com base no tier */
  public async checkQuota(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    const quota = await this.getUserQuota(user_id);

    if (tier === SubscriptionTier.INFINITY) return true;

    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const remaining = quota.daily_bonus_count + quota.scrape_balance;

    if (remaining <= 0 || quota.scrape_count >= maxScrapes) {
      await this.createItemScrapeLogService.execute({
        user_id,
        item_id: "",
        action: ItemScrapeAction.QUOTA_EXCEEDED,
        details: "User reached daily scraping limit",
      });
      throw new AppError("Daily scraping limit reached.");
    }

    return true;
  }

  /** 🔹 Consome múltiplas raspagens */
  public async consume(user_id: string, amount: number = 1): Promise<void> {
    if (amount <= 0) throw new AppError("Invalid consume amount.");

    const quota = await this.getUserQuota(user_id);
    const before = { ...quota };

    let totalToConsume = amount;
    let consumedFromBonus = 0;
    let consumedFromBalance = 0;

    while (totalToConsume > 0) {
      if (quota.daily_bonus_count > 0) {
        quota.daily_bonus_count--;
        consumedFromBonus++;
      } else if (quota.scrape_balance > 0) {
        quota.scrape_balance--;
        consumedFromBalance++;
      } else {
        throw new AppError("No remaining quota to consume.");
      }

      quota.scrape_count++;
      totalToConsume--;
    }

    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    console.log(color.green(`[UserQuotaService] 💰 Consumo realizado com sucesso`));
    console.table({
      solicitadas: amount,
      usadas_bonus: consumedFromBonus,
      usadas_balance: consumedFromBalance,
      saldo_anterior: before.scrape_balance,
      saldo_atual: quota.scrape_balance,
      total_usadas: quota.scrape_count,
    });

    await this.createItemScrapeLogService.execute({
      user_id,
      item_id: "",
      action: ItemScrapeAction.SCRAPE_USED,
      details: `Consumed ${amount} scrape(s) (${consumedFromBonus} bonus, ${consumedFromBalance} balance)`,
    });
  }

  /** 🔹 Consome uma raspagem apenas */
  public async consumeScrape(user_id: string): Promise<void> {
    return this.consume(user_id, 1);
  }

  /** 🔹 Atualiza ou reseta a quota conforme o tier */
  public async resetQuotaForTier(user_id: string, tier: SubscriptionTier): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const itemLimit = SubscriptionTierLimits[tier];

    if (!maxScrapes) throw new AppError(`No scrape limit found for tier: ${tier}`);
    if (itemLimit === undefined) throw new AppError(`No item limit found for tier: ${tier}`);

    // 🟢 Atualiza os limites conforme o plano
    quota.scrape_balance = maxScrapes;
    quota.daily_bonus_count = maxScrapes;
    quota.item_limit = itemLimit;
    quota.scrape_count = 0;

    await this.userQuotaRepository.save(quota);
    await this.refreshCache(user_id); // 🔥 garante sincronização imediata do cache

    console.log(color.cyan(`[UserQuotaService] ♻️ Quota resetada para tier ${tier}`));
    console.table({
      scrapes: maxScrapes,
      itens: itemLimit,
      user_id,
    });
  }

  /** 🔹 Adiciona bônus manual */
  public async addBonusScrapes(user_id: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const quota = await this.getUserQuota(user_id);
    quota.scrape_balance += amount;

    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    await this.createItemScrapeLogService.execute({
      user_id,
      item_id: "",
      action: ItemScrapeAction.SCRAPE_BONUS,
      details: `Added ${amount} bonus scrapes`,
    });

    console.log(color.green(`[UserQuotaService] 🎁 Adicionado bônus de ${amount} raspagens`));
  }

  /** 🔹 Reseta bônus diário */
  public async resetBonus(user_id: string, amount: number): Promise<void> {
    if (amount < 0) throw new AppError("Invalid bonus amount.");

    const quota = await this.getUserQuota(user_id);
    const before = quota.daily_bonus_count;

    quota.daily_bonus_count = amount;
    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    console.log(color.yellow(`[UserQuotaService] 🎯 Bônus diário resetado`));
    console.table({
      antes: before,
      depois: quota.daily_bonus_count,
      user_id,
    });

    await this.createItemScrapeLogService.execute({
      user_id,
      item_id: "",
      action: ItemScrapeAction.DAILY_BONUS_RESET,
      details: `Daily bonus reset to ${amount}`,
    });
  }

  /** 🔹 Atualiza cache e subscription após qualquer alteração de quota */
  private async syncSubscriptionCache(user_id: string, quota: UserQuota): Promise<void> {
    const cacheUser = `user:${user_id}`;
    const cacheSub = `user-subscription-${user_id}`;

    const cachedUser = await RedisCache.recover<any>(cacheUser);
    const cachedSub = await RedisCache.recover<{ subscription: any }>(cacheSub);

    if (cachedUser) {
      cachedUser.quota = {
        scrape_balance: quota.scrape_balance,
        total_scrapes_used: quota.scrape_count,
        item_limit: quota.item_limit,
      };
      await RedisCache.save(cacheUser, cachedUser, 300);
    }

    if (cachedSub?.subscription) {
      cachedSub.subscription.scrape_balance = quota.scrape_balance;
      cachedSub.subscription.total_scrapes_used = quota.scrape_count;
      cachedSub.subscription.item_limit = quota.item_limit;
      await RedisCache.save(cacheSub, cachedSub, 300);
    }
  }

  /** 🧩 Atualiza manualmente o cache (debug/manual) */
  public async refreshCache(user_id: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) return;

    await this.syncSubscriptionCache(user_id, quota);
    console.log(color.green(`[UserQuotaService] 🔄 Cache sincronizado para ${user_id}`));
  }
}
