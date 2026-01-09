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

/** 🎨 Cores ANSI para logs visuais */
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

  /** 🔹 Consome 1 slot de item (para criação de user_items) */
  public async consumeItemSlot(user_id: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);

    if (quota.item_limit <= 0)
      throw new AppError("Limite de itens atingido para este plano.", 403);

    quota.item_limit -= 1;
    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    console.log(
      color.green(`[UserQuotaService] 💾 Slot de item consumido | restante: ${quota.item_limit}`)
    );
  }

  /** 🔹 Checa quota de raspagem (sem consumir) */
  public async checkQuota(user_id: string, tier: SubscriptionTier): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (tier === SubscriptionTier.INFINITY) return;

    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const remaining = quota.daily_bonus_count + quota.scrape_balance;

    if (remaining <= 0 || quota.scrape_count >= maxScrapes) {
      await this.createItemScrapeLogService.execute({
        user_id,
        action: ItemScrapeAction.QUOTA_EXCEEDED,
        details: "User reached scraping limit (checkQuota)",
      });
      throw new AppError("Limite de raspagens atingido.", 403);
    }

    console.log(
      color.cyan(`[UserQuotaService] ✅ checkQuota aprovado | user:${user_id} | saldo:${remaining}`)
    );
  }

  /** 🔹 Consome 1 raspagem (modelo híbrido com saldo visual dinâmico) */
  public async consumeScrape(user_id: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    const before = { ...quota };

    if (quota.daily_bonus_count > 0) {
      quota.daily_bonus_count--;
      quota.scrape_balance--; // 🔹 Atualiza também o saldo total para refletir consumo visual
    } else if (quota.scrape_balance > 0) {
      quota.scrape_balance--;
    } else {
      throw new AppError("Sem saldo disponível para consumir.", 403);
    }

    quota.scrape_count++;
    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    console.log(color.green(`[UserQuotaService] 💰 1 raspagem consumida com sucesso`));
    console.table({
      saldo_anterior: before.scrape_balance,
      saldo_atual: quota.scrape_balance,
      total_usadas: quota.scrape_count,
    });

    await this.createItemScrapeLogService.execute({
      user_id,
      action: ItemScrapeAction.SCRAPE_USED,
      details: "1 scrape consumed successfully",
    });
  }

  /** 🔹 Registra erro sem consumo */
  public async logScrapeError(user_id: string, details: string): Promise<void> {
    await this.createItemScrapeLogService.execute({
      user_id,
      action: ItemScrapeAction.SCRAPE_ERROR,
      details,
    });

    console.log(color.red(`[UserQuotaService] ❌ Erro registrado: ${details}`));
  }

  /** 🔹 Reseta quotas conforme novo tier (upgrade de plano) */
  public async resetQuotaForTier(user_id: string, tier: SubscriptionTier): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const itemLimit = SubscriptionTierLimits[tier];

    if (!maxScrapes)
      throw new AppError(`Nenhum limite de raspagens definido para tier ${tier}`);
    if (itemLimit === undefined)
      throw new AppError(`Nenhum limite de itens definido para tier ${tier}`);

    quota.scrape_balance = maxScrapes;
    quota.daily_bonus_count = maxScrapes;
    quota.item_limit = itemLimit;
    quota.scrape_count = 0;

    await this.userQuotaRepository.save(quota);
    await this.refreshCache(user_id);

    console.log(color.cyan(`[UserQuotaService] ♻️ Quota resetada para tier ${tier}`));
  }

  /** 🔹 Recarga mensal automática (CRON) */
  public async resetMonthlyQuota(user_id: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const quota = await this.getUserQuota(user_id);
    quota.scrape_balance = amount;
    quota.daily_bonus_count = 0;
    quota.scrape_count = 0;

    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    console.log(color.yellow(`[UserQuotaService] 💰 Recarga mensal aplicada (+${amount})`));

    await this.createItemScrapeLogService.execute({
      user_id,
      action: ItemScrapeAction.MONTHLY_RESET,
      details: `Monthly quota reset to ${amount}`,
    });
  }

  /** 🔹 Reseta bônus diário manualmente */
  public async resetBonus(user_id: string, amount: number): Promise<void> {
    if (amount < 0) throw new AppError("Invalid bonus amount.");

    const quota = await this.getUserQuota(user_id);
    quota.daily_bonus_count = amount;

    await this.userQuotaRepository.save(quota);
    await this.syncSubscriptionCache(user_id, quota);

    await this.createItemScrapeLogService.execute({
      user_id,
      action: ItemScrapeAction.DAILY_BONUS_RESET,
      details: `Daily bonus reset to ${amount}`,
    });
  }

  /** 🔹 Sincroniza caches (user + subscription) */
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

  /** 🔹 Atualiza manualmente o cache */
  public async refreshCache(user_id: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) return;
    await this.syncSubscriptionCache(user_id, quota);
    console.log(color.green(`[UserQuotaService] 🔄 Cache sincronizado para ${user_id}`));
  }
}
