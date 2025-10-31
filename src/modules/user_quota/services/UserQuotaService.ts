import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';
import UserQuota from '../infra/typeorm/entities/UserQuota';

import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionTierScrapeLimits } from '@modules/subscriptions/enums/subscription-tier-scrape-limits.enum';
import { SubscriptionTierLimits } from '@modules/subscriptions/enums/subscription-limits.enum';

import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';
import { ICreateItemScrapeLogDTO } from '@modules/item_scrape_log/dtos/ICreateItemScrapeLogDTO';

import RedisCache from '@shared/cache/RedisCache';

@injectable()
export default class UserQuotaService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotaRepository: IUserQuotaRepository,

    @inject(CreateItemScrapeLogService)
    private createItemScrapeLogService: CreateItemScrapeLogService,
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

  /** 🔹 Checa se o usuário ainda tem raspagens disponíveis com base no tier */
  public async checkQuota(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    const quota = await this.getUserQuota(user_id);

    // Tier INFINITY ignora limites
    if (tier === SubscriptionTier.INFINITY) return true;

    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const remaining = quota.daily_bonus_count + quota.scrape_balance;

    if (remaining <= 0 || quota.scrape_count >= maxScrapes) {
      await this.createItemScrapeLogService.execute({
        user_id,
        item_id: '',
        action: ItemScrapeAction.QUOTA_EXCEEDED,
        details: 'User reached daily scraping limit',
      });

      throw new AppError('Daily scraping limit reached.');
    }

    return true;
  }

  /** 🔹 Consome 1 raspagem do saldo */
  public async consumeScrape(user_id: string, item_id?: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);

    if (quota.daily_bonus_count <= 0 && quota.scrape_balance <= 0) {
      throw new AppError('No remaining quota to consume.');
    }

    let source: 'DAILY_BONUS' | 'SCRAPE_BALANCE';

    if (quota.daily_bonus_count > 0) {
      quota.daily_bonus_count -= 1;
      source = 'DAILY_BONUS';
    } else {
      quota.scrape_balance -= 1;
      source = 'SCRAPE_BALANCE';
    }

    quota.scrape_count += 1;
    await this.userQuotaRepository.save(quota);

    /** 🔸 Atualiza cache */
    const cacheKey = `user:${user_id}`;
    const cachedUser = await RedisCache.recover<any>(cacheKey);

    if (cachedUser?.subscription) {
      cachedUser.subscription.scrape_balance = quota.scrape_balance;
      cachedUser.subscription.total_scrapes_used = quota.scrape_count;

      await RedisCache.save(
        cacheKey,
        cachedUser,
        cachedUser.subscription.tier === SubscriptionTier.INFINITY ? undefined : 300,
      );
    }

    /** 🔸 Cria log */
    const log: ICreateItemScrapeLogDTO = {
      user_id,
      item_id: item_id ?? '',
      action: ItemScrapeAction.SCRAPE_USED,
      details: `Quota consumed from: ${source}`,
    };

    await this.createItemScrapeLogService.execute(log);
  }

  /**
   * 🔹 Atualiza ou reseta a quota conforme o tier atual, herdando o saldo
   * remanescente e ajustando limites de itens e raspagens.
   */
  public async resetQuotaForTier(user_id: string, tier: SubscriptionTier): Promise<void> {
    const quota = await this.getUserQuota(user_id);

    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const itemLimit = SubscriptionTierLimits[tier];

    if (!maxScrapes) throw new AppError(`No scrape limit found for tier: ${tier}`);
    if (itemLimit === undefined)
      throw new AppError(`No item limit found for tier: ${tier}`);

    // 🔹 Mantém saldo anterior e adiciona o novo limite
    quota.scrape_balance = (quota.scrape_balance ?? 0) + maxScrapes;
    quota.daily_bonus_count = maxScrapes;
    quota.item_limit = itemLimit;

    await this.userQuotaRepository.save(quota);

    // 🔸 Atualiza cache
    const cacheKey = `user:${user_id}`;
    const cachedUser = await RedisCache.recover<any>(cacheKey);

    if (cachedUser?.subscription) {
      cachedUser.subscription.scrape_balance = quota.scrape_balance;
      cachedUser.subscription.total_scrapes_used = quota.scrape_count;
      await RedisCache.save(cacheKey, cachedUser, 300);
    }
  }

  /** 🔹 Adiciona bônus manual de raspagem (promoções, admin, etc.) */
  public async addBonusScrapes(user_id: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const quota = await this.getUserQuota(user_id);
    quota.scrape_balance += amount;
    await this.userQuotaRepository.save(quota);

    await RedisCache.invalidate(`user:${user_id}`);

    await this.createItemScrapeLogService.execute({
      user_id,
      item_id: '',
      action: ItemScrapeAction.SCRAPE_BONUS, // ✅ enum corrigido
      details: `Added ${amount} bonus scrapes`,
    });
  }

  public async resetBonus(user_id: string, amount: number): Promise<void> {
    if (amount < 0) throw new AppError('Invalid bonus amount.');

    const quota = await this.getUserQuota(user_id);
    quota.daily_bonus_count = amount;

    await this.userQuotaRepository.save(quota);

    // Atualiza cache
    await RedisCache.invalidate(`user:${user_id}`);

    // Cria log
    await this.createItemScrapeLogService.execute({
      user_id,
      item_id: '',
      action: ItemScrapeAction.DAILY_BONUS_RESET,
      details: `Daily bonus reset to ${amount}`,
    });
  }
}
