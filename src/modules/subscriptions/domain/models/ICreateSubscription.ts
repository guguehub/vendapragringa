import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export interface ICreateSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date?: Date;           // início da assinatura
  expires_at?: Date | null;    // fim da assinatura; null para INFINITY
  end_date?: Date;             // opcional, mantido para histórico ou relatórios
}
