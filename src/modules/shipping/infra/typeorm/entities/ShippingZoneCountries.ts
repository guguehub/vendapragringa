import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ShippingZone from './ShippingZone';

@Entity('shipping_zone_countries')
class ShippingZoneCountries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  countryCode: string; // Ex: 'BR', 'MX', 'US'

  @ManyToOne(() => ShippingZone, zone => zone.countries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: ShippingZone;
}

export default ShippingZoneCountries;
