import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import ShippingZoneCountry from './ShippingZoneCountry';

@Entity('shipping_zones')
class ShippingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => ShippingZoneCountry, zoneCountry => zoneCountry.zone)
  countries: ShippingZoneCountry[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export default ShippingZone;
