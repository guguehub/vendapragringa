import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { Subscription } from '../../../../subscriptions/infra/typeorm/entities/Subscription';
import { SavedItem } from '../../../../saved-items/infra/typeorm/entities/SavedItem';
import UserItem from '../../../../user_items/infra/typeorm/entities/UserItems';
import Supplier from '../../../../suppliers/infra/typeorm/entities/Supplier';
import UserAddress from './UserAddress';



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
  suppliers?: Supplier[];

  // 🔹 Relacionamento: cada usuário pode ter várias assinaturas
  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions?: Subscription[];

  // 🔹 Relacionamento: itens salvos/favoritos pelo usuário
  @OneToMany(() => SavedItem, item => item.user)
  savedItems?: SavedItem[];

  // 🔹 Relacionamento: itens custom/criados manualmente pelo usuário
  @OneToMany(() => UserItem, userItem => userItem.user)
  userItems?: UserItem[];

  // 🔹 Relacionamento: endereços vinculados ao usuário
  @OneToMany(() => UserAddress, address => address.user, { cascade: true })
  addresses?: UserAddress[];

  // 🔹 Flag dev/teste para controle de scrap gratuito
  @Column({ default: false })
  hasUsedFreeScrap: boolean;

  // 🔹 Controle de administrador
  @Column({ default: false })
  is_admin: boolean;

  // 🔹 Dados de billing (externo)
  @Column({ nullable: true })
  billing_customer_id?: string;

  @Column({ nullable: true })
  billing_status?: string;

  // 🔹 Controle de quotas e limites
  @Column({ type: 'int', default: 0 })
  scrape_count: number;

  @Column({ type: 'int', default: 0 })
  scrape_balance: number;

  @Column({ type: 'int', default: 0 })
  daily_bonus_count: number;

  @Column({ type: 'int', default: 0 })
  item_limit: number;

  // 🔹 Data de expiração do plano
  @Column({ type: 'timestamp', nullable: true })
  plan_expires_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export default User;
