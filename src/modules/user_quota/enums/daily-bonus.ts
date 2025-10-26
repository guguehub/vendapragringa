// src/modules/user_quota/enums/daily-bonus.ts
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

export const DailyBonusPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 5,
  [SubscriptionTier.BRONZE]: 10,
  [SubscriptionTier.SILVER]: 20,
  [SubscriptionTier.GOLD]: 50,
  [SubscriptionTier.INFINITY]: 100, // infinito pode receber um valor fixo grande
};
