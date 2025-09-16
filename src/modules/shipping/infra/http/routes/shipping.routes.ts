import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';

import { ShippingTypesController } from '../controllers/ShippingTypesController';
import { ShippingZonesController } from '../controllers/ShippingZonesController';
import { ShippingWeightsController } from '../controllers/ShippingWeightsController';
import { CalculateShippingController } from '../controllers/CalculateShippingController';
import ShippingPricesController from '../controllers/ShippingPricesController';

const shippingRoutes = Router();

const typesController = new ShippingTypesController();
const zonesController = new ShippingZonesController();
const weightsController = new ShippingWeightsController();
const calculateController = new CalculateShippingController();
const shippingPricesController = new ShippingPricesController();

// Listar tipos de frete (público, qualquer usuário)
shippingRoutes.get('/types', typesController.index);

// Listar zonas de frete (público)
shippingRoutes.get('/zones', zonesController.index);

// Listar faixas de peso (público)
shippingRoutes.get('/weights', weightsController.index);

// Calcular frete (público)
shippingRoutes.post(
  '/calculate',
  celebrate({
    [Segments.BODY]: {
      zone_id: Joi.string().uuid().required(),
      weight_id: Joi.string().uuid().required(),
      type_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).optional(),
    },
  }),
  calculateController.handle,
);

// Atualizar preço de frete (apenas admin)
shippingRoutes.put(
  '/prices/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      price: Joi.number().precision(2).required(),
    },
  }),
  shippingPricesController.update,
);

// Deletar preço de frete (apenas admin)
shippingRoutes.delete(
  '/prices/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  shippingPricesController.delete,
);

export default shippingRoutes;
