import { Router } from 'express';
//import ProductsController from '../controllers/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import ProductsController from '../controllers/ProductsControllers';

const productsRouter = Router();
const productsController = new ProductsController();

// Listar todos os produtos
productsRouter.get('/', isAuthenticated, productsController.index);

// Mostrar um produto pelo ID
productsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.show,
);

// Criar um novo produto
productsRouter.post(
  '/',
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

// Atualizar um produto existente
productsRouter.put(
  '/:id',
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

// Deletar um produto
productsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete,
);

export default productsRouter;
