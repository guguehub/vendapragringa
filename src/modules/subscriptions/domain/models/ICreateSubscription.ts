import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ICreateSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date?: Date | null;
  expires_at?: Date | null;
  isTrial?: boolean;           // default false
  cancelled_at?: Date | null;  // default null
}
