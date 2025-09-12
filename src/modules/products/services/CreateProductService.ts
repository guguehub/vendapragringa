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

  public async execute({
    name,
    price,
    quantity,
    listingUrl,
    mercadoLivreItemId,
    description,
    shippingPrice,
    status,
    condition,
    availableQuantity,
    sellerId,
    categoryId,
    images,
    currency,
    publishedAt,
    expirationDate,
    marketplace,
    itemType,
  }: ICreateProduct): Promise<IProduct> {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already a product with this name');
    }

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
      listingUrl,
      mercadoLivreItemId,
      description,
      shippingPrice,
      status,
      condition,
      availableQuantity,
      sellerId,
      categoryId,
      images,
      currency,
      publishedAt,
      expirationDate,
      marketplace,
      itemType,
    });

    return product;
  }
}

export default CreateProductService;
