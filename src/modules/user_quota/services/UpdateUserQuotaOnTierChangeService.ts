import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { QuotaInitialValues } from '../enums/quota-initial-values.enum';

@injectable()
export default class UpdateUserQuotaOnTierChangeService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotasRepository: IUserQuotaRepository,
  ) {}

  public async execute(user_id: string, newTier: SubscriptionTier): Promise<void> {
    const quota = await this.userQuotasRepository.findByUserId(user_id);
    if (!quota) {
      throw new AppError('Quota not found for user.');
    }

    const tierDefaults = QuotaInitialValues[newTier];

    if (!tierDefaults) {
      throw new AppError(`No quota defaults found for tier: ${newTier}`);
    }

    quota.scrape_balance += tierDefaults.scrape_balance;
    quota.daily_bonus_count = 0; // O cron aplicará o novo bônus
    quota.scrape_count = 0; // opcional: resetar o contador diário

    await this.userQuotasRepository.save(quota);
  }
}
