// src/modules/user_items/infra/http/routes/user-items.routes.ts

import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { CheckUserItemLimitMiddleware } from '../middlewares/CheckUserItemLimitMiddleware';
import UserItemsController from '../controllers/UserItemsController';

const userItemsRouter = Router();
const userItemsController = new UserItemsController();

// Aplica auth em todas as rotas
userItemsRouter.use(isAuthenticated);

// Listar itens do usuário
userItemsRouter.get('/', userItemsController.index);

// Criar item (com limite de plano + validação do body)
userItemsRouter.post(
  '/',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: {
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow(null, ''),
  item_link: Joi.string().uri().allow(null, ''),
},

  }),
  userItemsController.create,
);

// Deletar item do usuário
userItemsRouter.delete(
  '/:item_id',
  celebrate({
    [Segments.PARAMS]: {
      item_id: Joi.string().uuid().required(),
    },
  }),
  userItemsController.delete,
);

export default userItemsRouter;
