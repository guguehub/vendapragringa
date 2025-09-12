import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import redisCache from '../../../shared/cache/RedisCache';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IProduct[]> {
    // Tenta recuperar do cache
    let products = await redisCache.recover<IProduct[]>('api-vendas-PRODUCT-LIST');

    if (!products) {
      // Busca do banco se não estiver em cache
      products = await this.productsRepository.findAll();

      // Salva no cache
      await redisCache.save('api-vendas-PRODUCT-LIST', products);
    }

    return products;
  }
}

export default ListProductService;
