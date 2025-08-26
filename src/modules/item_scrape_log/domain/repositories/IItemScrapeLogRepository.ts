// src/modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository.ts
import { IItemScrapeLog } from '../models/IItemScrapeLog';

export interface IItemScrapeLogRepository {
  create(log: IItemScrapeLog): Promise<IItemScrapeLog>;
  listByItemId(item_id: string): Promise<IItemScrapeLog[]>;
  countUniqueUsers(item_id: string): Promise<number>;
}
