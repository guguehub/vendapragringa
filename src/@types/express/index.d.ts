import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        subscription?: {
          tier: SubscriptionTier;
        };
      };
      session?: {
        scrapedOnce?: boolean;
        // outras propriedades futuras
      };
    }
  }
}
