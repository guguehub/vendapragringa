export interface IUserItemLog {
  id?: string;
  user_item_id: string;
  user_id?: string | null;
  action: string;
  metadata?: Record<string, any>;
  created_at?: Date;
}