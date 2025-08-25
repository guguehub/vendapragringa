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

  // ----- Dados do Item (cru do scraper) -----
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

  // ----- Relacionamentos -----
  @Column({ name: 'supplier_id', type: 'uuid', nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, supplier => supplier.items, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  // 🔹 Essa relação pode ficar ou sair, depende:
  // - Se você vai precisar acessar userItems a partir de items → mantenha.
  // - Se não, pode remover.
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
