import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      subscription?: {
        tier: SubscriptionTier;
      };
    };
    session?: {
      scrapedOnce?: boolean;
      // você pode adicionar outras propriedades futuras de sessão aqui
    };
  }
}
