import { ICreateSupplier } from "../models/ICreateSupplier";
import { ISupplier } from "../models/ISupplier";
import { IUpdateSupplier } from "../models/IUpdateSupplier";

export interface ISupplierRepository {
  create(data: ICreateSupplier): Promise<ISupplier>;
  save(data: IUpdateSupplier): Promise<ISupplier>;
  remove(supplier: ISupplier): Promise<void>;
  findById(id: string): Promise<ISupplier | null>;
  findByName(name: string): Promise<ISupplier | null>;
  findByExternalId(external_id: string, marketplace: string): Promise<ISupplier | null>;
  findAll(): Promise<ISupplier[]>;
}
