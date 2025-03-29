import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
//import Product from '@modules/products/infra/typeorm/entities/Product';
import Product from '../../../../products/infra/typeorm/entities/Product';
//import User from '@modules/users/infra/typeorm/entities/User';
import User from '../../../../users/infra/typeorm/entities/User';

@Entity('suppliers')
class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  marketplace: string; // 'mercado_livre' | 'olx' | 'custom'

  @Column({ nullable: true })
  external_id: string; // Only for marketplace suppliers

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  zip_code: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, user => user.suppliers, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string; // Ensures only the owner can access

  @OneToMany(() => Product, product => product.supplier)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Supplier;
