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

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.userItems, { eager: false })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, { eager: false })
  @JoinColumn({ name: 'itemId' })
  item?: Item;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // Snapshot do Item
  @Column({ nullable: true })
  snapshotTitle?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  snapshotPrice?: number;

  @Column({ type: 'jsonb', nullable: true })
  snapshotImages?: string;

  @Column({ nullable: true })
  snapshotMarketplace?: string;

  @Column({ nullable: true })
  snapshotExternalId?: string;

  // eBay Specific
  @Column({ nullable: true })
  ebayTitle?: string;

  @Column({ nullable: true })
  ebayLink?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebayPrice?: number;

  @Column('int', { nullable: true })
  ebayShippingWeightGrams?: number;

  @Column({ type: 'boolean', default: false })
  isListedOnEbay: boolean = false;

  @Column({ type: 'boolean', default: false })
  isOfferEnabled: boolean = false;

  @Column({ type: 'boolean', default: false })
  isCampaignEnabled: boolean = false;

  // Finance Custom
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  ebayFeePercent?: number;

  @Column({ type: 'boolean', default: false })
  useCustomFeePercent: boolean = false;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  customFeePercent?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ebayFeesUsd?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  saleValueUsd?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  exchangeRate?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  receivedBrl?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  itemProfitBrl?: number;

  // Controle
  @Column({ type: 'varchar', nullable: true })
  syncStatus?: 'active' | 'paused' | 'sold_out';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', nullable: false, default: 'draft' })
  importStage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default UserItem;
