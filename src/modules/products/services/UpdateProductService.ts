// import 'reflect-metadata';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import ProductRepository from '../infra/typeorm/repositories/ProductsRepository';
import { injectable, inject } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && name != product.name) {
      throw new AppError('there is already one product with this name');
    }

    //const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
