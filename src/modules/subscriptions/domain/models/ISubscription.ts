import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ISubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;               // agora inclui INFINITY
  status: SubscriptionStatus;           // active, cancelled, expired
  start_date?: Date | null;
  expires_at?: Date | null;              // null se INFINITY
  end_date?: Date | null;                 // opcional, mantido para histórico ou relatórios
  created_at: Date;
  updated_at: Date;
}
