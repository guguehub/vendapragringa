import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(data: IUpdateProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(data.id);
    if (!product) {
      throw new AppError('Product not found');
    }

    // Checa se o novo title já existe em outro produto
    if (data.product_title && data.product_title !== product.product_title) {
      const existing = await this.productsRepository.findByName(data.product_title);
      if (existing) {
        throw new AppError('There is already a product with this title');
      }
    }

    // Atualiza apenas os campos enviados
    Object.assign(product, data);

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
