import 'reflect-metadata';
import redisCache from '../../../shared/cache/RedisCache';
import AppError from '../../../shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
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

    // Checa se o novo nome já existe em outro produto
    if (data.name && data.name !== product.name) {
      const productExists = await this.productsRepository.findByName(data.name);
      if (productExists) {
        throw new AppError('There is already a product with this name');
      }
    }

    // Atualiza todos os campos possíveis
    Object.assign(product, {
      name: data.name ?? product.name,
      price: data.price ?? product.price,
      quantity: data.quantity ?? product.quantity,
      listingUrl: data.listingUrl ?? product.listingUrl,
      marketplace: data.marketplace ?? product.marketplace,
      sellerId: data.sellerId ?? product.sellerId,
      description: data.description ?? product.description,
      shippingPrice: data.shippingPrice ?? product.shippingPrice,
      status: data.status ?? product.status,
      condition: data.condition ?? product.condition,
      availableQuantity: data.availableQuantity ?? product.availableQuantity,
      categoryId: data.categoryId ?? product.categoryId,
      images: data.images ?? product.images,
      currency: data.currency ?? product.currency,
      publishedAt: data.publishedAt ?? product.publishedAt,
      expirationDate: data.expirationDate ?? product.expirationDate,
      itemType: data.itemType ?? product.itemType,
    });

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
