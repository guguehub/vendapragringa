import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier';
import User from '../../../../users/infra/typeorm/entities/User';

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
  external_id: string; // If from a marketplace

  @Column({ nullable: true })
  marketplace: string; // e.g., 'mercado_livre', 'olx', 'custom'

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_price: number;

  @Column({ nullable: true })
  status: string; // 'available' | 'unavailable' | 'out_of_stock'

  @Column({ type: 'boolean', nullable: true })
  is_listed_on_ebay: boolean | null; // Nullable boolean field

  @Column({ name: 'supplier_id', nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, supplier => supplier.items, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_created_id' })
  createdBy?: User;

  @ManyToOne(() => User, user => user.items)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ name: 'user_created_id', nullable: true })
  userCreatedId?: string;

  @Column({ name: 'user_updated_id', nullable: true })
  userUpdatedId?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Item;
