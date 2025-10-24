import { injectable, inject } from 'tsyringe';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import UserQuotaService from './UserQuotaService';

@injectable()
export class CheckUserScrapeQuotaService {
  constructor(
    @inject(UserQuotaService)
    private userQuotaService: UserQuotaService,
  ) {}

  async execute(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    return this.userQuotaService.checkQuota(user_id, tier);
  }
}
