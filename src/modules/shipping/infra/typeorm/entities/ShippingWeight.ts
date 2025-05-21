import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shipping_weights')
class ShippingWeight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  min_weight: number; // ex: 0.0

  @Column('decimal')
  max_weight: number; // ex: 0.1

  @CreateDateColumn()
  created_at: Date;
}

export default ShippingWeight
