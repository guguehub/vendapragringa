import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('user_addresses')
class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Relacionamento com o usuário
  @ManyToOne(() => User, user => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  // 🔹 Endereço completo
  @Column()
  street: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  district: string; // bairro — muito usado no Brasil

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  country: string;

  // 🔹 Telefone no padrão de instituições de pagamento
  @Column({ nullable: true })
  country_code?: string; // Ex: '+55'

  @Column({ nullable: true })
  area_code?: string; // Ex: '11'

  @Column({ nullable: true })
  phone_number?: string; // Ex: '999999999'

  // 🔹 Flag de endereço principal
  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserAddress;
