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
  items?: Item[];

  // 🔹 Flag dev/teste para controle de scrap gratuito
  @Column({ default: false })
  hasUsedFreeScrap: boolean;

  // 🔹 Controle de administrador
  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
