import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';
import ProductsController from '../controllers/ProductsControllers';

const productsRouter = Router();
const productsController = new ProductsController();

/**
 * GET /products
 * Lista todos os produtos (público por enquanto)
 */
productsRouter.get('/', productsController.index);

/**
 * GET /products/:id
 * Mostrar um produto pelo ID (público)
 */
productsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.show,
);

/**
 * POST /products
 * Criar produto (apenas admin)
 */
productsRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.BODY]: {
      product_title: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      description: Joi.string().optional(),
      product_url: Joi.string().uri().optional(),
      image_url: Joi.string().uri().optional(),
      payment_method: Joi.string().optional(),
      category: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      published_at: Joi.date().optional(),
      expiration_date: Joi.date().optional(),
    },
  }),
  productsController.create,
);

/**
 * PUT /products/:id
 * Atualizar produto (apenas admin)
 */
productsRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      product_title: Joi.string().optional(),
      price: Joi.number().precision(2).optional(),
      description: Joi.string().optional(),
      product_url: Joi.string().uri().optional(),
      image_url: Joi.string().uri().optional(),
      payment_method: Joi.string().optional(),
      category: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      published_at: Joi.date().optional(),
      expiration_date: Joi.date().optional(),
    },
  }),
  productsController.update,
);

/**
 * DELETE /products/:id
 * Deletar produto (apenas admin)
 */
productsRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete,
);

export default productsRouter;
