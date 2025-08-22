import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';
import ItemsController from '../controllers/ItemsController';

const itemsRouter = Router();
const itemsController = new ItemsController();

// Listar itens do usuário
itemsRouter.get('/', isAuthenticated, itemsController.index);

// Detalhes de um item específico
itemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.show,
);

// Criar item (aplica limite do tier)
itemsRouter.post(
  '/',
  isAuthenticated,
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  itemsController.create
);

// Atualizar item
itemsRouter.put(
  '/:id',
  isAuthenticated,
);

// Deletar item
itemsRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  itemsController.delete
);

export default itemsRouter;
