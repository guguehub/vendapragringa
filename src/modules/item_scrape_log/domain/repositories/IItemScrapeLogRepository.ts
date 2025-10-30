import { ICreateItemScrapeLogDTO } from '../../dtos/ICreateItemScrapeLogDTO';
import ItemScrapeLog from '../../infra/typeorm/entities/ItemScrapeLog';

export interface IItemScrapeLogRepository {
  create(data: ICreateItemScrapeLogDTO): Promise<ItemScrapeLog>;
  listByItemId(item_id: string): Promise<ItemScrapeLog[]>;
  countUniqueUsers(item_id: string): Promise<number>;
}
