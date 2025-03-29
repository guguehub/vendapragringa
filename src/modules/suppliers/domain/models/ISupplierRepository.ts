import { ISupplier } from './ISupplier';
import { ICreateSupplier } from './ICreateSupplier';
import { IUpdateSupplier } from './IUpdateSupplier';

export interface ISupplierRepository {
  findById(id: string): Promise<ISupplier | null>;
  findByName(name: string): Promise<ISupplier | null>;
  create(data: ICreateSupplier): Promise<ISupplier>;
  save(supplier: IUpdateSupplier): Promise<ISupplier>;
  remove(supplier: ISupplier): Promise<void>;
  findAll(): Promise<ISupplier[]>;
}
