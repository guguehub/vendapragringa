// src/modules/item/infra/http/routes/item.routes.ts
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';
import ItemsController from '../controllers/ItemsController';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';

const itemsRouter = Router();
const itemsController = new ItemsController();

// Todas as rotas abaixo requerem usuário autenticado
itemsRouter.use(isAuthenticated);

// GET /items - lista itens
itemsRouter.get('/', itemsController.index);

// GET /items/:id - detalhes de um item
itemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.show,
);

// POST /items - cria item
itemsRouter.post(
  '/',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().required(),
      quantity: Joi.number().optional(),
      externalId: Joi.string().optional(),
      marketplace: Joi.string().optional(),
      condition: Joi.string().optional(),
      soldCount: Joi.number().optional(),
      shippingPrice: Joi.number().optional(),
      status: Joi.string().optional(), // ready | listed | sold
      itemStatus: Joi.string().optional(), // status real do anúncio
      itemLink: Joi.string().uri().optional(),
      images: Joi.array().items(Joi.string()).optional(),
      importStage: Joi.string().optional(), // draft | ready | listed etc.
      isDraft: Joi.boolean().optional(),
      isSynced: Joi.boolean().optional(),
      supplierId: Joi.string().uuid().optional(),
      createdBy: Joi.string().optional(),
    },
  }),
  itemsController.create,
);

// PUT /items/:id - atualiza item
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
      quantity: Joi.number().optional(),
      externalId: Joi.string().optional(),
      marketplace: Joi.string().optional(),
      condition: Joi.string().optional(),
      soldCount: Joi.number().optional(),
      shippingPrice: Joi.number().optional(),
      status: Joi.string().optional(),
      itemStatus: Joi.string().optional(),
      itemLink: Joi.string().uri().optional(),
      images: Joi.array().items(Joi.string()).optional(),
      importStage: Joi.string().optional(),
      isDraft: Joi.boolean().optional(),
      isSynced: Joi.boolean().optional(),
      supplierId: Joi.string().uuid().optional(),
      createdBy: Joi.string().optional(),
    },
  }),
  itemsController.update,
);

// DELETE /items/:id - deleta item
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
