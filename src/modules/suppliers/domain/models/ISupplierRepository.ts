import { ISupplier } from '../models/ISupplier';
import { ICreateSupplier } from '../models/ICreateSupplier';
import { IUpdateSupplier } from '../models/IUpdateSupplier';

export interface ISupplierRepository {
  findById(id: string): Promise<ISupplier | null>;
  findByName(name: string): Promise<ISupplier | null>;
  findAll(): Promise<ISupplier[]>;

  create(data: ICreateSupplier): Promise<ISupplier>;
  save(supplier: IUpdateSupplier): Promise<ISupplier>;
  remove(supplier: ISupplier): Promise<void>;
}
