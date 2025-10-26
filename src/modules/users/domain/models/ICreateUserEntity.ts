export interface ICreateUserEntity {
  name: string;
  email: string;
  password: string;
  avatar?: string;

  // Campos do banco que são importantes
  hasUsedFreeScrap: boolean;
  is_admin: boolean;

  scrape_count: number;
  scrape_balance: number;
  daily_bonus_count: number;
  item_limit: number;
}
