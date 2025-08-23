import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier';
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';

@Entity('items')
class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ----- Campos Gerais -----
  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  external_id?: string; // ID no marketplace (ML, OLX...)

  @Column({ nullable: true })
  marketplace?: string; // "mercadolivre" | "olx" | "shopee" ...

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_price?: number;

  @Column({ default: 'ready' })
  status: string; // "ready" | "listed" | "sold"

  @Column({ nullable: true })
  item_link?: string;

  @Column({ type: 'timestamp', nullable: true })
  last_scraped_at?: Date;

  @Column({ type: 'text', nullable: true })
  images?: string; // JSON string array

  @Column({ default: 'draft' })
  import_stage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  item_shipping_cost_brl?: number;

  @Column({ default: true })
  is_draft: boolean;

  @Column({ default: false })
  is_synced: boolean;

  // ----- Relacionamentos -----
  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, supplier => supplier.items, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @OneToMany(() => UserItem, userItem => userItem.item)
  userItems?: UserItem[];

  // ----- Metadata -----
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 'system' })
  created_by: string;
}

export default Item;
