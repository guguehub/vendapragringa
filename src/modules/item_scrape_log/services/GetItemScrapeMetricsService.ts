import { inject, injectable } from "tsyringe";
import { IItemScrapeLogRepository } from "@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository";
import { ItemScrapeAction } from "@modules/item_scrape_log/enums/item-scrape-action.enum";

@injectable()
export default class GetItemScrapeMetricsService {
  constructor(
    @inject("ItemScrapeLogRepository")
    private repository: IItemScrapeLogRepository
  ) {}

  public async execute(item_id: string) {
    const logs = await this.repository.listByItemId(item_id);
    const uniqueUsers = await this.repository.countUniqueUsers(item_id);

    // 🔹 Estatísticas híbridas
    const total = logs.length;
    const used = logs.filter(l => l.action === ItemScrapeAction.SCRAPE_USED).length;
    const errors = logs.filter(l => l.action === ItemScrapeAction.SCRAPE_ERROR).length;
    const quotaExceeded = logs.filter(l => l.action === ItemScrapeAction.QUOTA_EXCEEDED).length;

    return {
      total,
      uniqueUsers,
      used,
      errors,
      quotaExceeded,
    };
  }
}
