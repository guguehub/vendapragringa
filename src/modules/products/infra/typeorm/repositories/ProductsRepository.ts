import { Repository, In, DeepPartial } from 'typeorm';
import Product from '../entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IUpdateProduct } from '@modules/products/domain/models/IUpdateProduct';
import dataSource from '@shared/infra/typeorm/data-source';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Product);
  }

  public async create(data: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create(data as DeepPartial<Product>);
    await this.ormRepository.save(product);
    return product;
  }

  public async save(product: Product): Promise<IProduct> {
    await this.ormRepository.save(product);
    return product;
  }

  public async findById(id: string): Promise<Product | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  public async findAll(): Promise<Product[]> {
    return await this.ormRepository.find();
  }

  public async findByName(name: string): Promise<Product | null> {
    return await this.ormRepository.findOne({ where: { name } });
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async update(data: IUpdateProduct): Promise<Product> {
    const product = await this.findById(data.id);
    if (!product) throw new Error('Product not found');

    Object.assign(product, data);
    await this.ormRepository.save(product);

    return product;
  }

  public async findAllByIds(products: IProduct[]): Promise<Product[]> {
    const ids = products.map(p => p.id);
    return await this.ormRepository.find({ where: { id: In(ids) } });
  }
}

export default ProductsRepository;
