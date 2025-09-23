import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';

import ItemsController from '../controllers/ItemsController';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';

const itemsRouter = Router();
const itemsController = new ItemsController();

// Rotas abertas SOMENTE para usuários logados
itemsRouter.use(isAuthenticated);

itemsRouter.get('/', itemsController.index);

itemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.show,
);

itemsRouter.post(
  '/',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().required(),
      shippingPrice: Joi.number().optional(),
      status: Joi.string().optional(),
      itemStatus: Joi.string().optional(),
      soldCount: Joi.number().optional(),
      condition: Joi.string().optional(),
      externalId: Joi.string().optional(),
      marketplace: Joi.string().optional(),
      itemLink: Joi.string().uri().optional(),
      images: Joi.array().items(Joi.string()).optional(),
      isDraft: Joi.boolean().optional(),
      isSynced: Joi.boolean().optional(),
      supplierId: Joi.string().uuid().optional(),
    },
  }),
  itemsController.create,
);

itemsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      price: Joi.number().optional(),
      shippingPrice: Joi.number().optional(),
      status: Joi.string().optional(),
      itemStatus: Joi.string().optional(),
      soldCount: Joi.number().optional(),
      condition: Joi.string().optional(),
      externalId: Joi.string().optional(),
      marketplace: Joi.string().optional(),
      itemLink: Joi.string().uri().optional(),
      images: Joi.array().items(Joi.string()).optional(),
      isDraft: Joi.boolean().optional(),
      isSynced: Joi.boolean().optional(),
      supplierId: Joi.string().uuid().optional(),
    },
  }),
  itemsController.update,
);

itemsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.delete,
);

export default itemsRouter;
