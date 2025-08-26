// src/modules/item_scrape_log/services/ListItemScrapeLogsService.ts
import { inject, injectable } from 'tsyringe';
import { IItemScrapeLogRepository } from '@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository';
import { IItemScrapeLog } from '@modules/item_scrape_log/domain/models/IItemScrapeLog';

@injectable()
export default class ListItemScrapeLogsService {
  constructor(
    @inject('ItemScrapeLogRepository')
    private repository: IItemScrapeLogRepository,
  ) {}

  public async execute(): Promise<IItemScrapeLog[]> {
    return this.repository.listByItemId(''); // futuramente pode aceitar filtro
  }
}
