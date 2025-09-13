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
    const cacheKey = 'api-vendas-PRODUCT-LIST';

    // Tenta recuperar do cache
    let products = await redisCache.recover<IProduct[]>(cacheKey);

    if (!products) {
      // Busca do banco se não estiver no cache
      products = await this.productsRepository.findAll();

      // Salva no cache
      await redisCache.save(cacheKey, products);
    }

    return products;
  }
}

export default ListProductService;
