import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import AppError from '@shared/errors/AppError';
import { SubscriptionTierScrapeLimits } from '@modules/subscriptions/enums/subscription-tier-scrape-limits.enum';
import UserQuota from '../infra/typeorm/entities/UserQuota';
import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';
import { ICreateItemScrapeLogDTO } from '@modules/item_scrape_log/dtos/ICreateItemScrapeLogDTO';

@injectable()
export default class UserQuotaService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotaRepository: IUserQuotaRepository,

    @inject(CreateItemScrapeLogService)
    private createItemScrapeLogService: CreateItemScrapeLogService,
  ) {}

  public async getUserQuota(user_id: string): Promise<UserQuota | null> {
    return this.userQuotaRepository.findByUserId(user_id);
  }

  public async checkQuota(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) throw new AppError('User quota not found.');

    const maxScrapes = SubscriptionTierScrapeLimits[tier];
    const remaining = quota.daily_bonus_count + quota.scrape_balance;

    if (tier === SubscriptionTier.INFINITY) return true;

    if (remaining <= 0 || quota.scrape_count >= maxScrapes) {
      throw new AppError('Daily scraping limit reached.');
    }

    return true;
  }

  public async consumeScrape(user_id: string, item_id?: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) throw new AppError('User quota not found.');

    let actionTaken: 'DAILY_BONUS' | 'SCRAPE_BALANCE';

    if (quota.daily_bonus_count > 0) {
      quota.daily_bonus_count -= 1;
      actionTaken = 'DAILY_BONUS';
    } else if (quota.scrape_balance > 0) {
      quota.scrape_balance -= 1;
      actionTaken = 'SCRAPE_BALANCE';
    } else {
      throw new AppError('No remaining quota to consume.');
    }

    quota.scrape_count += 1;
    await this.userQuotaRepository.save(quota);

    const log: ICreateItemScrapeLogDTO = {
      user_id,
      item_id: item_id ?? '', // torna válido para o DTO
      action: ItemScrapeAction.SCRAPE_USED,
      details: `Quota consumed: ${actionTaken}`,
    };

    await this.createItemScrapeLogService.execute(log);
  }

  public async resetBonus(user_id: string, amount: number): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) throw new AppError('User quota not found.');

    quota.scrape_balance += quota.daily_bonus_count;
    quota.daily_bonus_count = amount;

    await this.userQuotaRepository.save(quota);

    const log: ICreateItemScrapeLogDTO = {
      user_id,
      item_id: '', // sem item associado
      action: ItemScrapeAction.DAILY_BONUS_RESET,
      details: `Daily bonus reset to ${amount}`,
    };

    await this.createItemScrapeLogService.execute(log);
  }
}
