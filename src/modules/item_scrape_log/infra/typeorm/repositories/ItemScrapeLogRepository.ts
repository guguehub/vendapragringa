// src/modules/item_scrape_log/infra/typeorm/repositories/ItemScrapeLogRepository.ts
import { Repository } from 'typeorm';
import { IItemScrapeLogRepository } from '@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository';
import { IItemScrapeLog } from '@modules/item_scrape_log/domain/models/IItemScrapeLog';
import ItemScrapeLog from '../entities/ItemScrapeLog';
import dataSource from '@shared/infra/typeorm/data-source';

export class ItemScrapeLogRepository implements IItemScrapeLogRepository {
  private ormRepository: Repository<ItemScrapeLog>;

  constructor() {
    this.ormRepository = dataSource.getRepository(ItemScrapeLog);
  }

  public async create(log: IItemScrapeLog): Promise<IItemScrapeLog> {
    const itemLog = this.ormRepository.create(log);
    await this.ormRepository.save(itemLog);
    return itemLog;
  }

  public async listByItemId(item_id: string): Promise<IItemScrapeLog[]> {
    return this.ormRepository.find({ where: { item_id } });
  }

  public async countUniqueUsers(item_id: string): Promise<number> {
    return this.ormRepository
      .createQueryBuilder('log')
      .where('log.item_id = :item_id', { item_id })
      .andWhere('log.user_id IS NOT NULL')
      .select('COUNT(DISTINCT log.user_id)', 'count')
      .getRawOne()
      .then(result => Number(result.count));
  }
}
