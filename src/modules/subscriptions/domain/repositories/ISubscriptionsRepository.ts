import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { Subscription } from '../../infra/typeorm/entities/Subscription';
import { ICreateSubscription } from '../models/ICreateSubscription';

export interface ISubscriptionRepository {
  create(data: ICreateSubscription): Promise<Subscription>;
  findByUserId(userId: string): Promise<Subscription | undefined>;
  findActiveByUserId(userId: string): Promise<Subscription | undefined>;
  save(subscription: Subscription): Promise<Subscription>;
  findByTier?(tier: SubscriptionTier): Promise<Subscription[]>;

  // 🔥 novo método para suportar UpdateSubscriptionService
  findById(id: string): Promise<Subscription | undefined>;
}
