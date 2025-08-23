import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';
import UserItemsController from '../controllers/UserItemsController';

const userItemsRouter = Router();
const userItemsController = new UserItemsController();

// Aplica auth em todas as rotas
userItemsRouter.use(isAuthenticated);

// Listar todos os itens do usuário
userItemsRouter.get('/', userItemsController.index);

// Mostrar um item específico
userItemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  userItemsController.show,
);

// Criar novo item (com limite de plano + validação do body)
userItemsRouter.post(
  '/',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: {
      item_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
    },
  }),
  userItemsController.create,
);

// Atualizar item
userItemsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      quantity: Joi.number().integer().min(1).optional(),
      notes: Joi.string().allow(null, '').optional(),
      import_stage: Joi.string()
        .valid('draft', 'pending', 'ready', 'listed', 'sold')
        .optional(),
      sync_status: Joi.string().valid('active', 'paused', 'sold_out').optional(),
    },
  }),
  userItemsController.update,
);

// Deletar item do usuário
userItemsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  userItemsController.delete,
);

export default userItemsRouter;
