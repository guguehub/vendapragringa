// src/modules/items/infra/typeorm/entities/Item.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';

@Entity('items')
@Unique(['externalId', 'marketplace']) // Garantia: um mesmo item não será duplicado para o mesmo marketplace
class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Dados do item cru do scraper */
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'external_id', nullable: true })
  externalId?: string;

  @Column({ nullable: true })
  marketplace?: string; // "mercadolivre" | "olx" | "shopee"

  @Column({
    name: 'shipping_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  shippingPrice?: number;

  @Column({ default: 'ready' })
  status: string; // ready | listed | sold

  @Column({ name: 'item_link', nullable: true })
  itemLink?: string;

  @Column({ name: 'last_scraped_at', type: 'timestamp', nullable: true })
  lastScrapedAt?: Date;

  @Column({ type: 'text', nullable: true })
  images?: string; // JSON string (ex: ["url1","url2"])

  @Column({ name: 'import_stage', default: 'draft' })
  importStage: string;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'is_synced', default: false })
  isSynced: boolean;

  /** Relações */
  @ManyToOne(() => Supplier, supplier => supplier.items, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  /** Metadata */
  @Column({ name: 'created_by', default: 'system' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
export default Item;
