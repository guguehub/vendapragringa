import { ItemScrapeAction } from '../enums/item-scrape-action.enum';

export interface ICreateItemScrapeLogDTO {
  item_id?: string | null;
  user_id?: string;
  ip_address?: string;
  listed_on_ebay?: boolean;
  action?: ItemScrapeAction; // 👈 mantém enum opcional
  details?: string;
  timestamp?: Date;
}
