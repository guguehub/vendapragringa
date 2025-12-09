// src/modules/user_quota/infra/typeorm/entities/UserQuota.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('user_quotas')
class UserQuota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'int', default: 0, nullable: false })
  scrape_count: number;

  @Column({ type: 'int', default: 0, nullable: false })
  scrape_balance: number;

  @Column({ type: 'int', default: 0, nullable: false })
  item_limit: number;

  @Column({ type: 'int', default: 0, nullable: false })
  daily_bonus_count: number;

  @Column({ type: 'int', default: 100, nullable: false })
  saved_items_limit: number;

  @Column({ type: 'int', default: 200, nullable: false })
  scrape_logs_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserQuota;
