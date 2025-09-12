import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
//import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  quantity: number;

  @Column()
  listingUrl: string;

  @Column({ nullable: true })
  mercadoLivreItemId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingPrice: number;

  @Column()
  status: string;

  @Column()
  condition: string;

  @Column('int', { default: 0 })
  availableQuantity: number;

  @Column()
  sellerId: string;

  @Column()
  categoryId: string;

  @Column('simple-array')
  images: string[];

  @Column()
  currency: string;

  @Column({ type: 'timestamp' })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date | null;

  @Column()
  marketplace: string;

  @Column()
  itemType: string;

  //@OneToMany(() => OrdersProducts, op => op.product)
  //order_products: OrdersProducts[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export default Product;
