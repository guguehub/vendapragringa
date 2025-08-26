// src/modules/item_scrape_log/infra/typeorm/entities/ItemScrapeLog.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('item_scrape_logs')
class ItemScrapeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  item_id: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ default: false })
  listed_on_ebay: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export default ItemScrapeLog;
