import { IsEnum } from 'class-validator';
//import { SubscriptionTier } from './subscription-tier.enum';
import { SubscriptionTier } from '../enums/subscription-tier.enum';

import { Transform } from 'class-transformer';

export class CreateSubscriptionDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;
}
