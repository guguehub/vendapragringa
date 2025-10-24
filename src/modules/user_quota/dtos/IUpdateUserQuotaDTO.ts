export interface IUpdateUserQuotaDTO {
  user_id: string;
  scrape_count?: number;
  scrape_balance?: number;
  daily_bonus_count?: number;
  item_limit?: number;
}
