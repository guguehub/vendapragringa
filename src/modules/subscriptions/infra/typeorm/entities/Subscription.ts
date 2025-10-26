import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';

import User from '../../../../users/infra/typeorm/entities/User';
import { SubscriptionTier } from '../../../../subscriptions/enums/subscription-tier.enum';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('subscriptions')
@Unique(['userId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  @Index()
  tier: SubscriptionTier;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @Column({ type: 'boolean', default: false })
  isTrial: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  /**
   * 💰 Saldo de raspagens disponíveis
   * Atualizado ao fazer upgrade de tier e incrementado pelos bônus diários ou recarga mensal.
   */
  @Column('integer', { default: 0 })
  scrape_balance: number;

  /**
   * 📊 Contador total de raspagens realizadas (não é resetado)
   * Útil para estatísticas e auditorias.
   */
  @Column('integer', { default: 0 })
  total_scrapes_used: number;

  @ManyToOne(() => User, user => user.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column()
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
