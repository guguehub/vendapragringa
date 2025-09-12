// src/modules/subscriptions/dtos/update-subscription.dto.ts
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../infra/typeorm/entities/Subscription';

export class UpdateSubscriptionDto {
  /**
   * Apenas para admin update
   */
  @IsOptional()
  @IsUUID()
  subscriptionId?: string;

  /**
   * Novo tier da assinatura
   */
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SubscriptionTier, { message: 'tier must be a valid subscription tier' })
  tier?: SubscriptionTier;

  /**
   * Status da assinatura (opcional, admin)
   */
  @IsOptional()
  @IsEnum(SubscriptionStatus, { message: 'status must be a valid subscription status' })
  status?: SubscriptionStatus;

  /**
   * Data de expiração manual (opcional, admin)
   */
  @IsOptional()
  @IsDateString({}, { message: 'expires_at must be a valid ISO date string' })
  expires_at?: string;
}
