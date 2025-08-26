// src/modules/item_scrape_log/domain/models/IItemScrapeLog.ts
export interface IItemScrapeLog {
  id?: string;
  item_id: string;
  user_id?: string; // opcional, se houver usuário
  ip_address?: string; // se raspagem anônima
  listed_on_ebay?: boolean;
  created_at?: Date;
}
