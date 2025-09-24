import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Item from '../../../../item/infra/typeorm/entities/Item';
import User from '../../../../users/infra/typeorm/entities/User';

@Entity('user_items')
class UserItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ----- Relacionamentos -----
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.userItems)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // ----- Snapshot do Item -----
  @Column({ nullable: true })
  snapshotTitle?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  snapshotPrice?: number;

  @Column({ type: 'text', nullable: true })
  snapshotImages?: string; // JSON string do array de imagens

  @Column({ nullable: true })
  snapshotMarketplace?: string;

  @Column({ nullable: true })
  snapshotExternalId?: string;

  // ----- eBay Specific -----
  @Column({ nullable: true })
  ebay_title?: string;

  @Column({ nullable: true })
  ebay_link?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebay_price?: number;

  @Column('int', { nullable: true })
  ebay_shipping_weight_grams?: number;

  @Column({ type: 'boolean', nullable: true })
  is_listed_on_ebay?: boolean;

  @Column({ type: 'boolean', nullable: true })
  is_offer_enabled?: boolean;

  @Column({ type: 'boolean', nullable: true })
  is_campaign_enabled?: boolean;

  // ----- Finance Custom -----
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  ebay_fee_percent?: number;

  @Column({ type: 'boolean', nullable: true })
  use_custom_fee_percent?: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  custom_fee_percent?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebay_fees_usd?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sale_value_usd?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  exchange_rate?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  received_brl?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  item_profit_brl?: number;

  // ----- Controle -----
  @Column({ type: 'varchar', nullable: true })
  sync_status?: 'active' | 'paused' | 'sold_out';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'draft',
  })
  import_stage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  // ----- Metadata -----
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserItem;
