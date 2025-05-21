import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
//import { UserSubscription } from './UserSubscription';
import { Subscription } from '../../../../subscriptions/infra/typeorm/entities/Subscription';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., 'Free', 'Pro', 'Premium'

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Product;
