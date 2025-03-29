import { Repository, In } from 'typeorm';
import Product from '../entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { dataSource } from '../../../../../shared/infra/typeorm';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Product);
  }

  public async updateStock(product: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(product);
  }

  // Modified create method to include the new fields
  public async create({
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
    marketplace, // Added marketplace
    itemType, // Added itemType
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({
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
      marketplace, // Save marketplace data
      itemType, // Save itemType
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async findById(id: string): Promise<Product | null> {
    const product = await this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'], // Ensure supplier is loaded
    });
    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.ormRepository.find({
      relations: ['supplier'], // Include supplier relation in all queries
    });
    return products;
  }

  public async findByName(name: string): Promise<Product | null> {
    const product = await this.ormRepository.findOne({
      where: { name },
      relations: ['supplier'],
    });
    return product;
  }

  // Find products by a list of IDs with supplier info
  public async findAllByIds(products: IProduct[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
      relations: ['supplier'], // Include supplier relation in the query
    });

    return existsProducts;
  }

  // New method to find products by marketplace name
  public async findByMarketplace(marketplace_name: string): Promise<Product[]> {
    const products = await this.ormRepository.find({
      where: {
        marketplace_name,
      },
      relations: ['supplier'],
    });

    return products;
  }

  // New method to find products by listing URL
  public async findByListingUrl(listing_url: string): Promise<Product | null> {
    const product = await this.ormRepository.findOne({
      where: {
        listing_url,
      },
      relations: ['supplier'],
    });

    return product;
  }
}

export default ProductsRepository;
