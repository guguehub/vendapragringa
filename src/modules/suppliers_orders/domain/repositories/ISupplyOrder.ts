import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { ICreateSupplierOrderProducts } from './ICreateSupplierOrderProducts';

export interface ISupplierOrder {
  id: string;
  supplier: ISupplier;
  supplier_order_products: ICreateSupplierOrderProducts[];
  created_at: Date;
  updated_at: Date;
}
