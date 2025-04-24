export interface ISubscription {
  id: string;
  user_id: string;
  plan: 'free' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}
