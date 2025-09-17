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

import Item from '../../../../item/infra/typeorm/entities/Item';
import User from '../../../../users/infra/typeorm/entities/User';
import { SupplierStatus } from '../../../domain/enums/supplier-status.enum';
import { IMarketplaces } from '../../../domain/models/IMarketplaces';

@Entity('suppliers')
class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  url?: string; // opcional

  @Column({
    type: 'enum',
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
  })
  status: SupplierStatus;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Item, item => item.supplier, { cascade: true })
  items: Item[];

  @ManyToOne(() => User, user => user.suppliers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  user_id?: string;

  @Column({
    type: 'enum',
    enum: IMarketplaces,
    nullable: true,
  })
  marketplace?: IMarketplaces;

  @Column({ nullable: true })
  external_id?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Supplier;
