import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import SupplierController from '../controllers/SupplierController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const supplierRouter = Router();
const controller = new SupplierController();

// Todas as rotas protegidas
supplierRouter.use(isAuthenticated);

// Listar suppliers
supplierRouter.get('/', controller.index.bind(controller));

// Criar supplier
supplierRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      marketplace: Joi.string().required(), // validar conforme enum IMarketplaces
      external_id: Joi.string().optional(),
      email: Joi.string().email().optional(),
      link: Joi.string().optional(),
      website: Joi.string().optional(),
      url: Joi.string().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zip_code: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'coming_soon').optional(),
      is_active: Joi.boolean().optional(),
    }),
  }),
  controller.create.bind(controller),
);

// Atualizar supplier
supplierRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional(),
      marketplace: Joi.string().optional(),
      external_id: Joi.string().optional(),
      email: Joi.string().email().optional(),
      link: Joi.string().optional(),
      website: Joi.string().optional(),
      url: Joi.string().optional(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zip_code: Joi.string().optional(),
      status: Joi.string().valid('active', 'inactive', 'coming_soon').optional(),
      is_active: Joi.boolean().optional(),
    }),
  }),
  controller.update.bind(controller),
);

// Deletar supplier
supplierRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().uuid().required(),
    }),
  }),
  controller.delete.bind(controller),
);

export default supplierRouter;
