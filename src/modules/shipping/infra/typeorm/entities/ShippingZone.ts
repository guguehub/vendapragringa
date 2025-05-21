import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shipping_zones')
class ShippingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // exemplo: 'Estados Unidos', 'Reino Unido', 'Outros'

  @CreateDateColumn()
  created_at: Date;
}

export default ShippingZone
