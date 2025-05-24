import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shipping_types')
class ShippingType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // exemplo: 'Documento', 'Produto'

    @Column()
  code: 'document' | 'product';


  @CreateDateColumn()
  created_at: Date;
}

export default ShippingType
