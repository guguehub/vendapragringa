// src/modules/item/infra/http/routes/item.routes.ts
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';

import ItemsController from '../controllers/ItemsController';

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
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().optional(),
    },
  }),
  itemsController.create,
);

// Somente admin pode alterar/excluir itens
itemsRouter.put(
  '/:id',
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().optional(),
      description: Joi.string().optional(),
    },
  }),
  itemsController.update,
);

itemsRouter.delete(
  '/:id',
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.delete,
);

export default itemsRouter;
