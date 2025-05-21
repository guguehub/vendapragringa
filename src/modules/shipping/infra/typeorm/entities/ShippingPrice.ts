import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import ShippingType from './ShippingType';
import ShippingZone from './ShippingZone';
import ShippingWeight from './ShippingWeight';

@Entity('shipping_prices')
class ShippingPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShippingType)
  @JoinColumn({ name: 'shipping_type_id' })
  shipping_type: ShippingType;

  @Column()
  shipping_type_id: string;

  @ManyToOne(() => ShippingZone)
  @JoinColumn({ name: 'shipping_zone_id' })
  shipping_zone: ShippingZone;

  @Column()
  shipping_zone_id: string;

  @ManyToOne(() => ShippingWeight)
  @JoinColumn({ name: 'shipping_weight_id' })
  shipping_weight: ShippingWeight;

  @Column()
  shipping_weight_id: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  created_at: Date;
}

export default ShippingPrice
