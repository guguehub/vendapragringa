import { IsEnum, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionTier } from '../enums/subscription-tier.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  userId: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SubscriptionTier, { message: 'tier must be a valid subscription tier' })
  tier: SubscriptionTier;
}
