export interface ICreateSubscription {
  user_id: string;
  plan: 'free' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'inactive';
}
