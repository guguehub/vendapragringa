import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';
import Item from '../../../../item/infra/typeorm/entities/Item';

@Entity('saved_items')
class SavedItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.savedItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  item_id: string;

  @CreateDateColumn()
  created_at: Date;
}

export { SavedItem };
