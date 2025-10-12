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

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.userItems, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item, { eager: false })
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // Snapshot
  @Column({ name: 'snapshot_title', nullable: true })
  snapshotTitle?: string;

  @Column('decimal', { name: 'snapshot_price', precision: 10, scale: 2, nullable: true })
  snapshotPrice?: number;

  @Column({ name: 'snapshot_images', type: 'jsonb', nullable: true })
  snapshotImages?: string[];

  @Column({ name: 'snapshot_marketplace', nullable: true })
  snapshotMarketplace?: string;

  @Column({ name: 'snapshot_external_id', nullable: true })
  snapshotExternalId?: string;

  // eBay Specific
  @Column({ name: 'ebay_title', nullable: true })
  ebayTitle?: string;

  @Column({ name: 'ebay_link', nullable: true })
  ebayLink?: string;

  @Column('decimal', { name: 'ebay_price', precision: 10, scale: 2, nullable: true })
  ebayPrice?: number;

  @Column('int', { name: 'ebay_shipping_weight_grams', nullable: true })
  ebayShippingWeightGrams?: number;

  @Column({ name: 'is_listed_on_ebay', type: 'boolean', default: false })
  isListedOnEbay: boolean = false;

  @Column({ name: 'is_offer_enabled', type: 'boolean', default: false })
  isOfferEnabled: boolean = false;

  @Column('decimal', { name: 'offer_amount', precision: 10, scale: 2, nullable: true })
  offerAmount?: number;

  @Column({ name: 'is_campaign_enabled', type: 'boolean', default: false })
  isCampaignEnabled: boolean = false;

  @Column('decimal', { name: 'campaign_percent', precision: 5, scale: 2, nullable: true })
  campaignPercent?: number;

  // Finance Custom
  @Column('decimal', { name: 'ebay_fee_percent', precision: 5, scale: 2, nullable: true })
  ebayFeePercent?: number;

  @Column({ name: 'use_custom_fee_percent', type: 'boolean', default: false })
  useCustomFeePercent: boolean = false;

  @Column('decimal', { name: 'custom_fee_percent', precision: 5, scale: 2, nullable: true })
  customFeePercent?: number;

  @Column('decimal', { name: 'ebay_fees_usd', precision: 10, scale: 2, nullable: true })
  ebayFeesUsd?: number;

  @Column('decimal', { name: 'sale_value_usd', precision: 10, scale: 2, nullable: true })
  saleValueUsd?: number;

  @Column('decimal', { name: 'exchange_rate', precision: 10, scale: 2, nullable: true })
  exchangeRate?: number;

  @Column('decimal', { name: 'received_brl', precision: 10, scale: 2, nullable: true })
  receivedBrl?: number;

  @Column('decimal', { name: 'item_profit_brl', precision: 10, scale: 2, nullable: true })
  itemProfitBrl?: number;

  // Controle
  @Column({ name: 'sync_status', type: 'varchar', nullable: true })
  syncStatus?: 'active' | 'paused' | 'sold_out';

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ name: 'import_stage', type: 'varchar', nullable: false, default: 'draft' })
  importStage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  // Metadata
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserItem;
