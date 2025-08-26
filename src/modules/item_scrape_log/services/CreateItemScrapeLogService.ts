// src/modules/item_scrape_log/services/CreateItemScrapeLogService.ts
import { inject, injectable } from 'tsyringe';
import { IItemScrapeLogRepository } from '@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository';
import { IItemScrapeLog } from '@modules/item_scrape_log/domain/models/IItemScrapeLog';

@injectable()
export default class CreateItemScrapeLogService {
  constructor(
    @inject('ItemScrapeLogRepository')
    private repository: IItemScrapeLogRepository,
  ) {}

  public async execute(data: IItemScrapeLog): Promise<IItemScrapeLog> {
    return this.repository.create(data);
  }
}
