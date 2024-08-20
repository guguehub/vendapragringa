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

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }
  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async findById(id: string): Promise<Product | null> {
    const product = await this.ormRepository.findOneBy({
      id,
    });
    return product;

    //throw new Error('Method not implemented.');
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
    //throw new Error('Method not implemented.');
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.ormRepository.find();
    //throw new Error('Method not implemented.');
    return products;
  }

  public async findByName(name: string): Promise<Product | null> {
    const product = await this.ormRepository.findOneBy({
      name,
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
