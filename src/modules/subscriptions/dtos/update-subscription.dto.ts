// src/modules/subscriptions/dtos/update-subscription.dto.ts
import { IsEnum, IsOptional, IsUUID, IsDateString, IsBoolean, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

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
   * Status da assinatura (apenas admin)
   */
  @IsOptional()
  @IsEnum(SubscriptionStatus, { message: 'status must be a valid subscription status' })
  status?: SubscriptionStatus;

  /**
   * Data de expiração manual (apenas admin)
   */
  @IsOptional()
  @IsDateString({}, { message: 'expires_at must be a valid ISO date string' })
  expires_at?: string;

  /**
   * Flag para trial (apenas admin)
   */
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  /**
   * Data de cancelamento (apenas admin)
   */
  @IsOptional()
  @IsDateString({}, { message: 'cancelled_at must be a valid ISO date string' })
  cancelled_at?: string;

  /**
   * Ajuste manual do saldo de raspagens (admin)
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  scrape_balance?: number;
}
