export interface ICreateSubscription {
  userId: string;
  tier: 'free' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'cancelled' | 'expired';
}
