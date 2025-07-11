import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShippingTypeCode } from '../../../../../modules/shipping/enums/ShippingTypeCode';

@Entity('shipping_types')
class ShippingType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ex: 'Documento', 'Produto'

  @Column({
    type: 'enum',
    enum: ShippingTypeCode,
  })
  code: ShippingTypeCode;

  @CreateDateColumn()
  created_at: Date;
}

export default ShippingType;
