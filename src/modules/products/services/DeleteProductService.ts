import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

interface IDeleteProduct {
  id: string;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    // Invalida cache para manter consistência
    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    // Remove do banco
    await this.productsRepository.remove(product);
  }
}

export default DeleteProductService;
