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
import UserItem from '../../../../user_items/infra/typeorm/entities/UserItems';
import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier'

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

  // 🔹 Relacionamento: cada usuário pode ter vários suppliers (inclusive custom)
  @OneToMany(() => Supplier, supplier => supplier.user)
  suppliers: Supplier[];

  // 🔹 Relacionamento: cada usuário pode ter várias assinaturas
  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions?: Subscription[];

  // 🔹 Relacionamento: itens salvos/favoritos pelo usuário
  @OneToMany(() => SavedItem, item => item.user)
  savedItems?: SavedItem[];

  // 🔹 Relacionamento: itens custom/criados manualmente pelo usuário
  @OneToMany(() => UserItem, userItem => userItem.user)
  userItems?: UserItem[];

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
