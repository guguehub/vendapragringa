import Product from '../infra/typeorm/entities/Product';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { inject, injectable } from 'tsyringe';
import { IProductPaginate } from '../domain/models/IProductPaginate';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    page,
    limit,
  }: SearchParams): Promise<IProductPaginate> {
    const take = limit;
    const skip = (Number(page) - 1) * take;

    const products = await this.productsRepository.findAll({
      page,
      skip,
      take,
    });

    //const redisCache = new RedisCache();

    if (!products) {
      let products = await this.productsRepository.findAll({
        page,
        skip,
        take,
      });
      return products;

      //await redisCache.save('api-vendas-PRODUCT-LIST', products);
    }

    return products;
  }
}

export default ListProductService;
