import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  userId: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SubscriptionTier, { message: 'tier must be a valid subscription tier' })
  tier: SubscriptionTier;

  @IsOptional()
  @IsEnum(SubscriptionStatus, { message: 'status must be a valid subscription status' })
  status?: SubscriptionStatus;

  @IsOptional()
  isTrial?: boolean;
}
