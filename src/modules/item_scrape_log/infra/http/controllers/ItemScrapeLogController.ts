// src/modules/item_scrape_log/infra/http/controllers/ItemScrapeLogController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListItemScrapeLogsService from '@modules/item_scrape_log/services/ListItemScrapeLogsService';
import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';

export default class ItemScrapeLogController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listService = container.resolve(ListItemScrapeLogsService);
    const logs = await listService.execute();
    return response.json(logs);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { item_id, user_id, ip_address, listed_on_ebay } = request.body;
    const createService = container.resolve(CreateItemScrapeLogService);
    const log = await createService.execute({ item_id, user_id, ip_address, listed_on_ebay });
    return response.status(201).json(log);
  }


}
