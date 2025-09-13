import { Repository, In, DeepPartial } from 'typeorm';
import Product from '../entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
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

  public async findById(id: string): Promise<IProduct | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  public async findAll(): Promise<IProduct[]> {
    return await this.ormRepository.find();
  }

  public async findByName(product_title: string): Promise<IProduct | null> {
    return await this.ormRepository.findOne({ where: { product_title } });
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }
}

export default ProductsRepository;
