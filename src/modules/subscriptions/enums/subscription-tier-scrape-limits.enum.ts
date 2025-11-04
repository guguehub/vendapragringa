// src/modules/subscriptions/enums/subscription-tier-scrape-limits.enum.ts

import { SubscriptionTier } from './subscription-tier.enum';

export const SubscriptionTierScrapeLimits: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,     // nenhum permitido
  [SubscriptionTier.BRONZE]: 5,   // testar estouro (6)
  [SubscriptionTier.SILVER]: 10,  // testar uso parcial (8)
  [SubscriptionTier.GOLD]: 15,    // testar uso parcial (10)
  [SubscriptionTier.INFINITY]: 9999, // ilimitado (teste 12)
} as const;
/**
 * Mapeamento de cotas de raspagem por tier.
 * Tipado como Record<SubscriptionTier, number> para permitir
 * indexação segura: SubscriptionTierScrapeLimits[tier]

export const SubscriptionTierScrapeLimits: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 20,
  [SubscriptionTier.BRONZE]: 100,
  [SubscriptionTier.SILVER]: 150,
  [SubscriptionTier.GOLD]: 300,
  [SubscriptionTier.INFINITY]: Infinity,
} as const;
*/
