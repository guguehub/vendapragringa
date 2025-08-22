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

@Entity('items')
class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ----- Campos Gerais do Item -----

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  external_id: string; // ID no marketplace (ML, OLX...)

  @Column({ nullable: true })
  marketplace: string; // "mercadolivre" | "olx" | "shopee" ...

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_price: number;

  @Column({ nullable: true })
  status: string; // ex: "active", "paused", "sold_out"

  // ----- Links -----

  @Column({ nullable: true })
  item_link: string;

  // ----- Metadata -----

  @Column({ type: 'timestamp', nullable: true })
  last_scraped_at: Date;

  @Column({ type: 'text', nullable: true })
  images: string; // JSON stringified array of URLs

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'draft',
  })
  import_stage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  // ----- Finance Básico -----

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  item_shipping_cost_brl: number;

  // ----- Estado / Controle -----

  @Column({ type: 'boolean', default: true })
  is_draft: boolean;

  @Column({ type: 'boolean', default: false })
  is_synced: boolean;

  // ----- Relacionamentos -----

  @Column({ name: 'supplier_id', nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, supplier => supplier.items, { nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  // ----- Metadata -----

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 'system' })
  created_by: string;
}

export default Item;
