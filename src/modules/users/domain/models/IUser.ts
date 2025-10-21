import { IItem } from '@modules/item/domain/models/IItem';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  hasUsedFreeScrap: boolean;
  is_admin: boolean ;

  scrape_count: number;
scrape_balance: number;
daily_bonus_count: number;
item_limit:number

  items?: IItem[];               // Items associated with the user
  subscription?: ISubscription;  // 👈 relação com Subscription

  created_at: Date;
  updated_at: Date;
}
