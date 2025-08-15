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
  external_id: string;

  @Column({ nullable: true })
  marketplace: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shipping_price: number;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'boolean', nullable: true })
  is_listed_on_ebay: boolean | null;

  // ----- eBay Specific Fields -----

  @Column({ nullable: true })
  ebay_title: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebay_offer_value_usd: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_offer_enabled: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_campaign_enabled: boolean;

  @Column('int', { nullable: true })
  ebay_shipping_weight_grams: number;

  @Column({ nullable: true })
  ebay_category: string;

  // ----- Links -----

  @Column({ nullable: true })
  ml_link: string;

  @Column({ nullable: true })
  ebay_link: string;

  // ----- Metadata -----

  @Column('text', { nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  last_scraped_at: Date;

  @Column({ nullable: true })
  tags: string; // comma-separated tags

  @Column({ type: 'text', nullable: true })
  images: string; // JSON stringified array of URLs

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'draft',
  })
  import_stage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  // ----- Finance Fields -----

  @Column('decimal', { precision: 5, scale: 2, default: 13.25 })
  ebay_fee_percent: number;

  @Column({ type: 'boolean', default: false })
  use_custom_fee_percent: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  custom_fee_percent: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebay_fees_usd: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_value_usd: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  exchange_rate: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  received_brl: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  item_profit_brl: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ml_shipping_cost_brl: number;

  // ----- State / Control -----

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

  @ManyToOne(() => User, user => user.items)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_created_id' })
  createdBy?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_updated_id' })
  updatedBy?: User;

  @Column({ type: 'boolean', default: false })
  is_favorite: boolean;




  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default Item;
