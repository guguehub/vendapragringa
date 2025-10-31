import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        is_admin?: boolean;
        subscription?: {
          id: string;
          status: SubscriptionStatus; // ✅ enum correto
          tier: SubscriptionTier;
          start_date: string | null;
          expires_at: string | null;
          isTrial: boolean;
          cancelled_at: string | null;
          userId: string;
          created_at: string | null; // ✅ aceita null
          updated_at: string | null; // ✅ aceita null
          scrape_balance: number;        // ✅ adicionados
          total_scrapes_used: number;    // ✅ adicionados
        } | null;
      };
      session?: {
        scrapedOnce?: boolean;
        [key: string]: any;
      };
    }
  }
}
