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

  items?: IItem[];               // Items associated with the user
  subscription?: ISubscription;  // 👈 relação com Subscription

  created_at: Date;
  updated_at: Date;
}
