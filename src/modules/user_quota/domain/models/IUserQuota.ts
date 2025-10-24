// src/modules/user_quota/domain/models/IUserQuota.ts
import { IUser } from '@modules/users/domain/models/IUser';

export interface IUserQuota {
  id: string;
  user_id: string;
  user?: IUser;              // relacionamento opcional
  saved_items_limit: number;
  scrape_logs_limit: number;
  scrape_count: number;
  scrape_balance: number;
  daily_bonus_count: number;
  item_limit: number;        // ⚠ obrigatório na entidade
  created_at: Date;
  updated_at: Date;
}
