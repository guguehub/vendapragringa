// domain/models/ISubscription.ts
export interface ISubscription {
  id: string;
  userId: string;
  tier: 'free' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'cancelled' | 'expired';
  startDate?: Date | null;
  endDate?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
