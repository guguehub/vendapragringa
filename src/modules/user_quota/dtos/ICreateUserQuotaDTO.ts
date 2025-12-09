export interface ICreateUserQuotaDTO {
  user_id: string;
  saved_items_limit?: number;
  scrape_logs_limit?: number;
  scrape_count?: number;
  scrape_balance?: number;
  item_limit?: number;
  daily_bonus_count?: number;

}
