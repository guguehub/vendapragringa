import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionTier } from '../enums/subscription-tier.enum';

export class UpdateSubscriptionDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SubscriptionTier, { message: 'newTier must be a valid subscription tier' })
  newTier: SubscriptionTier;
}
