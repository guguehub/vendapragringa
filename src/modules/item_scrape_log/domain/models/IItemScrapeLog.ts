import { ItemScrapeAction } from '../../enums/item-scrape-action.enum';

export interface IItemScrapeLog {
  id?: string; // opcional para criação
  item_id?: string | null; // opcional — compatível com entidade
  user_id?: string;
  ip_address?: string;
  listed_on_ebay?: boolean;
  action?: ItemScrapeAction;
  details?: string;
  timestamp?: Date; // 👈 adiciona o campo faltante
  created_at?: Date;
  updated_at?: Date;
}
