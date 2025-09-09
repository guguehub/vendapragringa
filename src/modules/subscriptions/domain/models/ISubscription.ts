import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ISubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;               // agora inclui INFINITY
  status: SubscriptionStatus;           // active, cancelled, expired
  startDate?: Date | null;
  expiresAt?: Date | null;              // null se INFINITY
  endDate?: Date | null;                 // opcional, mantido para histórico ou relatórios
  createdAt: Date;
  updatedAt: Date;
}
