import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ISubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;               // inclui INFINITY
  status: SubscriptionStatus;           // active, cancelled, expired
  start_date?: Date | null;
  expires_at?: Date | null;             // null se INFINITY
  isTrial: boolean;
  cancelled_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
