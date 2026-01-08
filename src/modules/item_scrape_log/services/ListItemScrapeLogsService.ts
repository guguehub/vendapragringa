import { inject, injectable } from "tsyringe";
import { IItemScrapeLogRepository } from "@modules/item_scrape_log/domain/repositories/IItemScrapeLogRepository";
import { IItemScrapeLog } from "@modules/item_scrape_log/domain/models/IItemScrapeLog";
import { ItemScrapeAction } from "@modules/item_scrape_log/enums/item-scrape-action.enum";

interface IListFilters {
  item_id?: string;
  user_id?: string;
  action?: ItemScrapeAction;
}

@injectable()
export default class ListItemScrapeLogsService {
  constructor(
    @inject("ItemScrapeLogRepository")
    private repository: IItemScrapeLogRepository
  ) {}

  /**
   * 🔹 Lista logs híbridos com filtros opcionais
   * Baseia-se em listByItemId() e filtra localmente conforme necessário
   */
  public async execute(filters: IListFilters = {}): Promise<IItemScrapeLog[]> {
    const { item_id, user_id, action } = filters;

    // 🔸 O único método garantido é listByItemId
    //    Se não for fornecido item_id, recuperamos de forma neutra (todos os itens)
    const logs = item_id
      ? await this.repository.listByItemId(item_id)
      : await this.repository.listByItemId("");

    // 🔸 Filtros locais (user_id e action)
    const filtered = logs.filter((log: IItemScrapeLog) => {
      const matchUser = !user_id || log.user_id === user_id;
      const matchAction = !action || log.action === action;
      return matchUser && matchAction;
    });

    return filtered;
  }
}
