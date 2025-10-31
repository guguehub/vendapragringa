import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ISubscriptionSerialized {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date: string | null;
  expires_at: string | null;
  isTrial: boolean;
  cancelled_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
