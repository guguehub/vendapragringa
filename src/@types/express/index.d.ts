import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        is_admin?: boolean; // ✅ adiciona aqui
        subscription?: {
          tier: SubscriptionTier;
        };
      };
      session?: {
        scrapedOnce?: boolean;
        // outras propriedades que podemos adicionar futuramente
        [key: string]: any; // flexibilidade controlada
      };
    }
  }
}
