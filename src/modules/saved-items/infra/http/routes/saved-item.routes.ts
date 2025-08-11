// src/modules/saved-items/infra/http/routes/saved-items.routes.ts
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import SavedItemsController from '../controllers/SavedItemscontroller';


const savedItemsRouter = Router();
const savedItemsController = new SavedItemsController();

savedItemsRouter.use(isAuthenticated);

savedItemsRouter.get('/', savedItemsController.index);

savedItemsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      item_id: Joi.string().uuid().required(),
    },
  }),
  savedItemsController.create,
);

savedItemsRouter.delete(
  '/:item_id',
  celebrate({
    [Segments.PARAMS]: {
      item_id: Joi.string().uuid().required(),
    },
  }),
  savedItemsController.delete,
);

export default savedItemsRouter;
