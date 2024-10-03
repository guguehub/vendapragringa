import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('supplier_orders')
class SupplyOrders implements ISupplyOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, supplier => supplier.supplierOrder)
  supplier: Supplier;

  @ManyToOne(() => Product, product => product.supplierOrder)
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
