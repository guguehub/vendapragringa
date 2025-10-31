import { Repository } from 'typeorm';
import { IItemScrapeLogRepository } from '@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository';
import { ICreateItemScrapeLogDTO } from '@modules/item_scrape_log/dtos/ICreateItemScrapeLogDTO';
import ItemScrapeLog from '../entities/ItemScrapeLog';
import dataSource from '@shared/infra/typeorm/data-source';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';

export class ItemScrapeLogRepository implements IItemScrapeLogRepository {
  private ormRepository: Repository<ItemScrapeLog>;

  constructor() {
    this.ormRepository = dataSource.getRepository(ItemScrapeLog);
  }

  public async create(data: ICreateItemScrapeLogDTO): Promise<ItemScrapeLog> {
    const entity = this.ormRepository.create({
      item_id: data.item_id ?? null, // ✅ garante compatibilidade com string | null
      user_id: data.user_id,
      ip_address: data.ip_address,
      listed_on_ebay: data.listed_on_ebay ?? false,
      action: data.action ?? ItemScrapeAction.SCRAPE_USED,
      details: data.details,
      timestamp: data.timestamp ?? new Date(), // ✅ mantém compatível com DTO
    });

    return this.ormRepository.save(entity);
  }

  public async listByItemId(item_id: string): Promise<ItemScrapeLog[]> {
    return this.ormRepository.find({ where: { item_id } });
  }

  public async countUniqueUsers(item_id: string): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder('log')
      .where('log.item_id = :item_id', { item_id })
      .andWhere('log.user_id IS NOT NULL')
      .select('COUNT(DISTINCT log.user_id)', 'count')
      .getRawOne();

    return Number(result?.count || 0);
  }
}
