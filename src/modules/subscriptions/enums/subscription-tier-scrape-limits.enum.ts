// src/modules/subscriptions/enums/subscription-tier-scrape-limits.enum.ts

import { SubscriptionTier } from './subscription-tier.enum';

/**
 * Mapeamento de cotas de raspagem por tier.
 * Tipado como Record<SubscriptionTier, number> para permitir
 * indexação segura: SubscriptionTierScrapeLimits[tier]
 */
export const SubscriptionTierScrapeLimits: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 20,
  [SubscriptionTier.BRONZE]: 100,
  [SubscriptionTier.SILVER]: 150,
  [SubscriptionTier.GOLD]: 300,
  [SubscriptionTier.INFINITY]: Infinity,
} as const;
