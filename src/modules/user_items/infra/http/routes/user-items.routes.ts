// src/modules/user_items/infra/http/routes/user-items.routes.ts
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { CheckUserItemLimitMiddleware } from '@shared/infra/http/middlewares/CheckUserItemLimitMiddleware';
import UserItemsController from '../controllers/UserItemsController';
import SaveAsUserItemController from '../controllers/SaveAsUserItemController';
import populateSubscription from '@shared/infra/http/middlewares/populateSubscription';

const userItemsRouter = Router();
const userItemsController = new UserItemsController();
const saveAsUserItemController = new SaveAsUserItemController();

// Aplica autenticação em todas as rotas
userItemsRouter.use(isAuthenticated);
userItemsRouter.use(populateSubscription);


// Listar todos os itens do usuário
userItemsRouter.get('/', userItemsController.index);

// Mostrar item específico
userItemsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  userItemsController.show,
);

// Criar novo item do usuário
userItemsRouter.post(
  '/',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object({
      item_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).optional(),
      notes: Joi.string().allow(null, '').optional(),
      sync_status: Joi.string().valid('active', 'paused', 'sold_out').optional(),
      import_stage: Joi.string()
        .valid('draft', 'pending', 'ready', 'listed', 'sold')
        .optional(),

      snapshotTitle: Joi.string().optional(),
      snapshotPrice: Joi.number().optional(),
      snapshotImages: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
      snapshotMarketplace: Joi.string().optional(),
      snapshotExternalId: Joi.string().optional(),

      ebay_title: Joi.string().optional(),
      ebay_link: Joi.string().optional(),
      ebay_price: Joi.number().allow(null).optional(),
      ebay_shipping_weight_grams: Joi.number().allow(null).optional(),
      is_listed_on_ebay: Joi.boolean().optional(),
      is_offer_enabled: Joi.boolean().optional(),
      is_campaign_enabled: Joi.boolean().optional(),

      ebay_fee_percent: Joi.number().allow(null).optional(),
      use_custom_fee_percent: Joi.boolean().optional(),
      custom_fee_percent: Joi.number().allow(null).optional(),
      ebay_fees_usd: Joi.number().allow(null).optional(),
      sale_value_usd: Joi.number().allow(null).optional(),
      exchange_rate: Joi.number().allow(null).optional(),
      received_brl: Joi.number().allow(null).optional(),
      item_profit_brl: Joi.number().allow(null).optional(),
    }),
  }),
  userItemsController.create,
);

// Criar user item a partir de um item existente (Save As)
userItemsRouter.post(
  '/save_as',
  CheckUserItemLimitMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object({
      item_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).optional(),
      import_stage: Joi.string()
        .valid('draft', 'pending', 'ready', 'listed', 'sold')
        .optional(),
    }),
  }),
  saveAsUserItemController.create,
);

// Atualizar item do usuário
userItemsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
    [Segments.BODY]: Joi.object({
      quantity: Joi.number().integer().min(1).optional(),
      notes: Joi.string().allow(null, '').optional(),
      import_stage: Joi.string().valid('draft', 'pending', 'ready', 'listed', 'sold').optional(),
      sync_status: Joi.string().valid('active', 'paused', 'sold_out').optional(),
    }),
  }),
  userItemsController.update,
);

// Deletar item do usuário
userItemsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
  }),
  userItemsController.delete,
);

export default userItemsRouter;
