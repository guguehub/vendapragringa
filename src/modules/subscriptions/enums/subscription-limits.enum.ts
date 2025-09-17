import { SubscriptionTier } from './subscription-tier.enum';

export const SubscriptionTierLimits: Record<SubscriptionTier, number> = {
  free: 6,
  bronze: 25,
  silver: 50,
  gold: 150,
  infinity: Infinity,
};
