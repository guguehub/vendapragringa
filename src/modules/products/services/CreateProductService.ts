import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(data: ICreateProduct): Promise<IProduct> {
    const { product_title } = data;

    const productExists = await this.productsRepository.findByName(product_title);
    if (productExists) {
      throw new AppError('There is already a product with this title');
    }

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    const product = await this.productsRepository.create(data);

    return product;
  }
}

export default CreateProductService;
