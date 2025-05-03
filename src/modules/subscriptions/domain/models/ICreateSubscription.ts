import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

export interface ICreateSubscription {
  userId: string;
  //tier: 'free' | 'bronze' | 'silver' | 'gold';
  tier: SubscriptionTier;
  //status: 'active' | 'inactive' | 'cancelled' | 'expired';
  status: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  expiresAt?: Date;
}
