import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Subscription } from '../../../../subscriptions/infra/typeorm/entities/Subscription';
import { SavedItem } from '../../../../saved-items/infra/typeorm/entities/SavedItem';
//import Item from '@modules/item/infra/typeorm/entities/Item';
import Item from '../../../../item/infra/typeorm/entities/Item';
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

  @OneToMany(() => Item, item => item.user)
  items?: Item[]=[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
