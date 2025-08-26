// src/modules/item_scrap_log/infra/http/routes/item-scrap-log.routes.ts
import { Router } from 'express';
import  ItemScrapeLogController  from '../controllers/ItemScrapeLogController';

const itemScrapLogRoutes = Router();
const itemScrapeLogController = new ItemScrapeLogController();

itemScrapLogRoutes.get('/', itemScrapeLogController.index);
itemScrapLogRoutes.post('/', itemScrapeLogController.create);

export default itemScrapLogRoutes;
