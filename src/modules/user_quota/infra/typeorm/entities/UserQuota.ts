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

  @Column({ type: 'int', default: 0 })
  scrape_count: number;

  @Column({ type: 'int', default: 0 })
  scrape_balance: number;

  @Column({ type: 'int', default: 0 })
  item_limit: number;

  @Column({ type: 'int', default: 0 })
  daily_bonus_count: number;

  @Column({ type: 'int', default: 100 })
  saved_items_limit: number;

  @Column({ type: 'int', default: 200 })
  scrape_logs_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserQuota;
