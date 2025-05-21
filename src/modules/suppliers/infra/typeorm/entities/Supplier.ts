import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Item from '../../../../item/infra/typeorm/entities/Item';

@Entity('suppliers')
class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'mercado_livre', 'olx'

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Item, item => item.supplier)
  items: Item[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Supplier;
