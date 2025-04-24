import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Subscription } from '../../../../subscriptions/infra/typeorm/entities/Subscription';
import { SavedItem } from '../../../../item/infra/typeorm/entities/SavedItem';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions?: Subscription[];

  @OneToMany(() => SavedItem, item => item.user)
  savedItems?: SavedItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
