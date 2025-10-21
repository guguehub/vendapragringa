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

@Entity('item_scrape_logs')
class ItemScrapeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  item_id: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ nullable: true })
  user_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ default: false })
  listed_on_ebay: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export default ItemScrapeLog;
