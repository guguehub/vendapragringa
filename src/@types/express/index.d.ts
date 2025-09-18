import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        is_admin?: boolean;
        subscription?: {
          id: string;
          status: string;
          tier: SubscriptionTier;
          start_date: string | null;
          expires_at: string | null;
          isTrial: boolean;
          cancelled_at: string | null;
          userId: string;
          created_at: string;
          updated_at: string;
        } | null;
      };
      session?: {
        scrapedOnce?: boolean;
        [key: string]: any;
      };
    }
  }
}
