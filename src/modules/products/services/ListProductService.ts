import Product from '../infra/typeorm/entities/Product';
import redisCache from '../../../shared/cache/RedisCache';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IProduct[] | null> {
    const product = await this.productsRepository.findAll();

    //const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[] | null>(
      'api-vendas-PRODUCT-LIST',
    );

    if (!products) {
      let products = await this.productsRepository.findAll();

      await redisCache.save('api-vendas-PRODUCT-LIST', products);
    }

    return products;
  }
}

export default ListProductService;
