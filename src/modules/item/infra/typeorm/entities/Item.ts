import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier';

@Entity('items')
class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  marketplace: string; // e.g., 'mercado_livre', 'olx', 'custom'

  @Column({ nullable: true })
  external_id: string; // If from a marketplace

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_price: number;

  @Column({ nullable: true })
  status: string; // 'available' | 'unavailable' | 'out_of_stock'

  @Column({ type: 'boolean', nullable: true })
  is_listed_on_ebay: boolean | null; // Nullable boolean field

  @ManyToOne(() => Supplier, supplier => supplier.products, { nullable: true })
  supplier: Supplier;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Item;
