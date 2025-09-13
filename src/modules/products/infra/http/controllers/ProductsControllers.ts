import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProductService from '@modules/products/services/ListProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import AppError from '@shared/errors/AppError';

export default class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listService = container.resolve(ListProductService);
    const products = await listService.execute();
    return res.status(200).json(products);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Product ID is required', 400);
    }

    const showService = container.resolve(ShowProductService);
    const product = await showService.execute({ id });
    return res.status(200).json(product);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const {
      product_title,
      price,
      description,
      product_url,
      image_url,
      payment_method,
      category,
      tags,
      published_at,
      expiration_date,
    } = req.body;

    if (!product_title || price === undefined) {
      throw new AppError('Product title and price are required', 400);
    }

    const createService = container.resolve(CreateProductService);
    const product = await createService.execute({
      product_title,
      price,
      description,
      product_url,
      image_url,
      payment_method,
      category,
      tags,
      published_at,
      expiration_date,
    });

    return res.status(201).json(product);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Product ID is required', 400);
    }

    const updateService = container.resolve(UpdateProductService);
    const product = await updateService.execute({ ...req.body, id });

    return res.status(200).json(product);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id) {
      throw new AppError('Product ID is required', 400);
    }

    const deleteService = container.resolve(DeleteProductService);
    await deleteService.execute({ id });

    return res.status(204).send();
  }
}
