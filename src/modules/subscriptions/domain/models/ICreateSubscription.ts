import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ICreateSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate?: Date;           // início da assinatura
  expiresAt?: Date | null;    // fim da assinatura; null para INFINITY
  endDate?: Date;             // opcional, mantido para histórico ou relatórios
}
