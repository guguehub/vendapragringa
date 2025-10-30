// src/modules/item_scrape_log/infra/typeorm/entities/ItemScrapeLog.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';

@Entity('item_scrape_logs')
class ItemScrapeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  item_id?: string | null;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @Column({ nullable: true })
  user_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ default: false })
  listed_on_ebay: boolean;

  @Column({ type: 'enum', enum: ItemScrapeAction, nullable: true })
  action?: ItemScrapeAction;

  @Column({ nullable: true, type: 'text' })
  details?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @CreateDateColumn()
  created_at: Date;
}

export default ItemScrapeLog;
