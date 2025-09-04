import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Item from '../../../../item/infra/typeorm/entities/Item'
import User from '../../../../users/infra/typeorm/entities/User'


@Entity('suppliers')
class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Nome do fornecedor ou marketplace

  @Column()
  url: string; // URL principal do fornecedor/marketplace

  @Column({ default: 'active' })
  status: 'active' | 'coming_soon'; // Define se está ativo ou "em breve"

  // Se for null → supplier global
  // Se tiver valor → supplier custom de um usuário
  @ManyToOne(() => User, user => user.suppliers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  user_id?: string;

  @OneToMany(() => Item, item => item.supplier)
  items: Item[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Supplier;
