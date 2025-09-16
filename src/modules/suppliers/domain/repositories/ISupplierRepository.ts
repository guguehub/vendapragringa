// src/modules/suppliers/domain/repositories/ISupplierRepository.ts
import { ICreateSupplier } from '../models/ICreateSupplier';
import { IUpdateSupplier } from '../models/IUpdateSupplier';
import { ISupplier } from '../models/ISupplier';

export interface ISupplierRepository {
  create(data: ICreateSupplier): Promise<ISupplier>;
  save(supplier: IUpdateSupplier): Promise<ISupplier>;
  remove(supplier: ISupplier): Promise<void>;
  findById(id: string): Promise<ISupplier | null>;
  findByName(name: string): Promise<ISupplier | null>;
  findByExternalId(
    external_id: string,
    marketplace: string,
  ): Promise<ISupplier | null>;
  findAll(): Promise<ISupplier[]>; // simplificado, sem paginação
}
