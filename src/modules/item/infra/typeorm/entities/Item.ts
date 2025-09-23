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

import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier';

@Entity('items')
@Unique(['externalId', 'marketplace']) // Garante que não haja duplicata no mesmo marketplace
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

  @Column({ nullable: true })
  condition?: string; // novo | usado (quando disponível)

  @Column({ name: 'sold_count', type: 'int', nullable: true })
  soldCount?: number;

  @Column({
    name: 'shipping_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  shippingPrice?: number;

  @Column({ default: 'ready' })
  status: string; // ready | listed | sold (status interno da aplicação)

  @Column({ name: 'item_status', nullable: true })
  itemStatus?: string;
  // Status real do anúncio no marketplace
  // ex: "Ativo", "Pausado", "Encerrado", "Sob revisão", "Finalizado"

  @Column({ name: 'item_link', nullable: true })
  itemLink?: string;

  @Column({ name: 'last_scraped_at', type: 'timestamp', nullable: true })
  lastScrapedAt?: Date;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value?: string[]) => (value ? JSON.stringify(value) : null),
      from: (value?: string) => (value ? JSON.parse(value) : []),
    },
  })
  images?: string[];

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
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export default Item;
