// src/modules/suppliers/infra/http/routes/suppliers.routes.ts
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import SupplierController from '../controllers/SupplierController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';

const supplierRouter = Router();
const controller = new SupplierController();

/**
 * GET /suppliers
 * Lista todos os suppliers ativos (marketplaces e custom)
 * Qualquer usuário autenticado pode visualizar
 */
supplierRouter.get('/', isAuthenticated, controller.index.bind(controller));

/**
 * POST /suppliers
 * Criar supplier (marketplace ou custom) — apenas admin
 */
supplierRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      type: Joi.string().valid('marketplace', 'custom').required(),
      marketplace: Joi.string().when('type', {
        is: 'marketplace',
        then: Joi.required(),
        otherwise: Joi.forbidden(), // só é permitido se type = marketplace
      }),
      external_id: Joi.string().optional(),
      email: Joi.string().email().optional(),
      link: Joi.string().uri().optional(),
      website: Joi.string().uri().optional(),
      url: Joi.string().uri().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zip_code: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'coming_soon').optional(),
      is_active: Joi.boolean().optional(),
    },
  }),
  controller.create.bind(controller),
);

/**
 * PUT /suppliers/:id
 * Atualizar supplier (somente admin)
 */
supplierRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().optional(),
      type: Joi.string().valid('marketplace', 'custom').optional(),
      marketplace: Joi.string().when('type', {
        is: 'marketplace',
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      }),
      external_id: Joi.string().optional(),
      email: Joi.string().email().optional(),
      link: Joi.string().uri().optional(),
      website: Joi.string().uri().optional(),
      url: Joi.string().uri().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zip_code: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'coming_soon').optional(),
      is_active: Joi.boolean().optional(),
    },
  }),
  controller.update.bind(controller),
);

/**
 * DELETE /suppliers/:id
 * Deletar supplier (somente admin)
 */
supplierRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  controller.delete.bind(controller),
);

export default supplierRouter;
