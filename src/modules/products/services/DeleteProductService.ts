//import 'reflect-metadata';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IDeleteOrder } from '@modules/orders/domain/models/IDeleteOrder';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private ProductsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IDeleteOrder): Promise<void> {
    const product = await this.ProductsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }
    //const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCT-LIST');
    await this.ProductsRepository.remove(product);
  }
}

export default DeleteProductService;
