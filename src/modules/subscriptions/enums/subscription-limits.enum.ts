import { SubscriptionTier } from './subscription-tier.enum';

export const SubscriptionTierLimits: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 1,     // apenas 1 item salvo permitido
  [SubscriptionTier.BRONZE]: 5,   // testar limite e estouro (6)
  [SubscriptionTier.SILVER]: 10,  // testar uso parcial (8)
  [SubscriptionTier.GOLD]: 15,    // testar uso parcial (10)
  [SubscriptionTier.INFINITY]: 9999, // ilimitado
} as const;
/*
export const SubscriptionTierLimits: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 1,     // apenas 1 item salvo permitido
  [SubscriptionTier.BRONZE]: 10,  // até 10 itens
  [SubscriptionTier.SILVER]: 25,  // até 25 itens
  [SubscriptionTier.GOLD]: 50,    // até 50 itens
  [SubscriptionTier.INFINITY]: 9999,
} as const;

/*
export const SubscriptionTierLimits: Record<SubscriptionTier, number> = {
  free: 6,
  bronze: 25,
  silver: 50,
  gold: 150,
  infinity: Infinity,
};
*/
