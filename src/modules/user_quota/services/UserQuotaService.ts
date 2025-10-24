import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import AppError from '@shared/errors/AppError';
import { SubscriptionTierScrapeLimits } from '@modules/subscriptions/enums/subscription-tier-scrape-limits.enum';
import UserQuota from '../infra/typeorm/entities/UserQuota';

@injectable()
export default class UserQuotaService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  public async getUserQuota(user_id: string): Promise<UserQuota | null> {
    return this.userQuotaRepository.findByUserId(user_id);
  }

  /**
   * Checa se o usuário ainda tem quota disponível.
   */
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

  /**
   * Consome uma unidade da quota após uma raspagem.
   */
  public async consumeScrape(user_id: string): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) throw new AppError('User quota not found.');

    // ⚡ Primeiro consome o daily bonus
    if (quota.daily_bonus_count > 0) {
      quota.daily_bonus_count -= 1;
    } else if (quota.scrape_balance > 0) {
      quota.scrape_balance -= 1;
    } else {
      throw new AppError('No remaining quota to consume.');
    }

    quota.scrape_count += 1;
    await this.userQuotaRepository.save(quota);
  }

  /**
   * Reseta o daily bonus do usuário.
   * Soma o daily bonus ao scrape_balance e zera o daily bonus.
   */
  public async resetBonus(user_id: string, amount: number): Promise<void> {
    const quota = await this.getUserQuota(user_id);
    if (!quota) throw new AppError('User quota not found.');

    // ⚡ Somar o daily bonus restante ao saldo principal
    quota.scrape_balance += quota.daily_bonus_count;

    // ⚡ Atualiza daily bonus com o valor do dia
    quota.daily_bonus_count = amount;

    await this.userQuotaRepository.save(quota);
  }
}
