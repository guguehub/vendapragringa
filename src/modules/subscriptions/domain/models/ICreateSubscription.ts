import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ICreateSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date?: Date;            // opcional, diferente de created_at se precisar
  expires_at?: Date | null;     // null = sem limite
  end_date?: Date | null;       // usado só quando expira/cancela
}
