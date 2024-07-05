import { IProduct } from '../models/IProduct';
import { ICreateProduct } from '../models/ICreateProduct';
export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findById(id: string): Promise<IProduct | undefined>;
  findByEmail(email: string): Promise<IProduct | undefined>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(customer: IProduct): Promise<IProduct>;
  remove(customer: IProduct): Promise<void>;
  findAll(): Promise<IProduct[] | undefined>;
}
