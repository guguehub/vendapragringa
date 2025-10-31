import { inject, injectable } from 'tsyringe';
import { IItemScrapeLogRepository } from '../domain/repositories/IItemScrapeLogRepository';
import { ICreateItemScrapeLogDTO } from '../dtos/ICreateItemScrapeLogDTO';
import ItemScrapeLog from '../infra/typeorm/entities/ItemScrapeLog';
import { ItemScrapeAction } from '../enums/item-scrape-action.enum';

@injectable()
class CreateItemScrapeLogService {
  constructor(
    @inject('ItemScrapeLogRepository')
    private itemScrapeLogRepository: IItemScrapeLogRepository,
  ) {}

  public async execute({
    item_id,
    user_id,
    ip_address,
    listed_on_ebay = false,
    action = ItemScrapeAction.SCRAPE_USED,
    details,
    timestamp = new Date(),
  }: ICreateItemScrapeLogDTO): Promise<ItemScrapeLog> {
    const log = await this.itemScrapeLogRepository.create({
      item_id: item_id || null,
      user_id,
      ip_address,
      listed_on_ebay,
      action,
      details,
      timestamp,
    });

    return log;
  }
}

export default CreateItemScrapeLogService;
