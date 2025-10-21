import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_item_logs')
export default class UserItemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_item_id: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column()
  action: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}