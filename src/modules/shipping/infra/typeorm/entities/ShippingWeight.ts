import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('shipping_weights')
class ShippingWeight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  min_kg: number;

  @Column('float')
  max_kg: number;

  @CreateDateColumn()
  created_at: Date;
}

export default ShippingWeight;
