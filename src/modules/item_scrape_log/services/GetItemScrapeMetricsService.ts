// src/modules/item_scrape_log/services/GetItemScrapeMetricsService.ts
import { inject, injectable } from 'tsyringe';
import { IItemScrapeLogRepository } from '@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository';

@injectable()
export default class GetItemScrapeMetricsService {
  constructor(
    @inject('ItemScrapeLogRepository')
    private repository: IItemScrapeLogRepository,
  ) {}

  public async execute(item_id: string) {
    const logs = await this.repository.listByItemId(item_id);
    const uniqueUsers = await this.repository.countUniqueUsers(item_id);

    return { total: logs.length, uniqueUsers };
  }
}
