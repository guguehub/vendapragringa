import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        is_admin?: boolean;

        /** 🔹 Informações de cota de raspagem (UserQuota) */
        quota?: {
          scrape_balance: number;
          total_scrapes_used: number;
                item_limit?: number; // ✅ adiciona aqui

        };

        /** 🔹 Informações da assinatura (Subscription) */
        subscription?: {
          id: string;
          status: SubscriptionStatus;
          tier: SubscriptionTier;
          start_date: string | null;
          expires_at: string | null;
          isTrial: boolean;
          cancelled_at: string | null;
          userId: string;
          created_at: string | null;
          updated_at: string | null;
          scrape_balance: number;
          total_scrapes_used: number;
        } | null;
      };

      /** 🔹 Sessão express (para raspagem anônima) */
      session?: {
        scrapedOnce?: boolean;
        [key: string]: any;
      };
    }
  }
}

export {};
