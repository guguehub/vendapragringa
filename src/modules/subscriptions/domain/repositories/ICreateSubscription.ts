import { ISubscription } from '../models/ISubscription';
import { ICreateSubscription } from '../models/ICreateSubscription';

export interface ISubscriptionRepository {
  create(data: ICreateSubscription): Promise<ISubscription>;
  findByUserId(user_id: string): Promise<ISubscription | undefined>;
}
