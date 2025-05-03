declare namespace Express {
  export interface Request {
    user: {
      id: string;
      subscription?: {
        tier: import('@modules/subscriptions/enums/subscription-tier.enum').SubscriptionTier;
      };
    };
  }
}
