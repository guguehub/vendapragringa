import { inject, injectable } from "tsyringe";
import { IItemScrapeLogRepository } from "../domain/repositories/IItemScrapeLogRepository";
import { ICreateItemScrapeLogDTO } from "../dtos/ICreateItemScrapeLogDTO";
import ItemScrapeLog from "../infra/typeorm/entities/ItemScrapeLog";
import { ItemScrapeAction } from "../enums/item-scrape-action.enum";
import AppError from "@shared/errors/AppError";

// 🎨 Cores ANSI para logs visuais
const color = {
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
};

@injectable()
class CreateItemScrapeLogService {
  constructor(
    @inject("ItemScrapeLogRepository")
    private itemScrapeLogRepository: IItemScrapeLogRepository
  ) {}

  /**
   * 🔹 Cria log de scraping (uso, erro, bônus, etc.)
   * Compatível com fluxo híbrido: SCRAPE_USED / SCRAPE_ERROR / QUOTA_EXCEEDED
   */
  public async execute({
    item_id,
    user_id,
    ip_address,
    listed_on_ebay = false,
    action = ItemScrapeAction.SCRAPE_USED,
    details,
    timestamp = new Date(),
  }: ICreateItemScrapeLogDTO): Promise<ItemScrapeLog> {
    if (!user_id && !item_id) {
      throw new AppError("Log inválido: é necessário user_id ou item_id.");
    }

    const log = await this.itemScrapeLogRepository.create({
      item_id: item_id || null,
      user_id,
      ip_address,
      listed_on_ebay,
      action,
      details,
      timestamp,
    });

    // 🎯 Log visual
    if (action === ItemScrapeAction.SCRAPE_ERROR) {
      console.log(color.red(`[LOG][SCRAPE_ERROR] ${details ?? "Erro sem detalhes"}`));
    } else if (action === ItemScrapeAction.QUOTA_EXCEEDED) {
      console.log(color.yellow(`[LOG][QUOTA_EXCEEDED] Limite atingido para ${user_id}`));
    } else if (action === ItemScrapeAction.SCRAPE_USED) {
      console.log(color.green(`[LOG][SCRAPE_USED] Consumo registrado para ${user_id}`));
    }

    return log;
  }
}

export default CreateItemScrapeLogService;
