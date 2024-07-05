import { Repository, In, getRepository } from 'typeorm';

import Product from '../entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProduct } from '@modules/products/domain/models/IProduct';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;
  constructor() {
    this.ormRepository = getRepository(Product);
  }

  async create({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }
  async remove(product: Product): Promise<void | undefined> {
    await this.ormRepository.remove(product);
  }

  async findById(id: string): Promise<IProduct | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        id,
      },
    });
    return product;

    //throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<IProduct | undefined> {
    throw new Error('Method not implemented.');
  }

  async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
    //throw new Error('Method not implemented.');
  }

  public async findAll(): Promise<IProduct[] | undefined> {
    const products = await this.ormRepository.find();
    return products;
    //throw new Error('Method not implemented.');
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return product;
  }
  public async findAllByIds(products: IProduct[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existsProducts;
  }
}
export default ProductsRepository;
