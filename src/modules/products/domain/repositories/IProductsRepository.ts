import { IProduct } from '../models/IProduct';
import { ICreateProduct } from '../models/ICreateProduct';
import { IFindProducts } from '../models/IFindProducts';
import { IUpdateStockProduct } from '../models/IUpdateStockProduct';
import { IProductPaginate } from '../models/IProductPaginate';

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findById(id: string): Promise<IProduct | undefined>;
  findByEmail(email: string): Promise<IProduct | undefined>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(customer: IProduct): Promise<IProduct>;
  remove(customer: IProduct): Promise<void>;
  findAll({ page, skip, take }: SearchParams): Promise<IProductPaginate>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  updateStock(products: IUpdateStockProduct[]): Promise<void>;
}
