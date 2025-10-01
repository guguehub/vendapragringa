import { IsUUID, IsOptional, IsString, IsNumber, IsBoolean, IsIn } from 'class-validator';

export class CreateUserItemDTO {
  @IsUUID()
  item_id: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['draft', 'pending', 'ready', 'listed', 'sold'])
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';

  @IsOptional()
  @IsIn(['active', 'paused', 'sold_out'])
  sync_status?: 'active' | 'paused' | 'sold_out';

  // Snapshot
  @IsOptional() @IsString() snapshotTitle?: string;
  @IsOptional() @IsNumber() snapshotPrice?: number;
  @IsOptional() snapshotImages?: string[];
  @IsOptional() @IsString() snapshotMarketplace?: string;
  @IsOptional() @IsString() snapshotExternalId?: string;

  // eBay
  @IsOptional() @IsString() ebay_title?: string;
  @IsOptional() @IsString() ebay_link?: string;
  @IsOptional() @IsNumber() ebay_price?: number;
  @IsOptional() @IsNumber() ebay_shipping_weight_grams?: number;
  @IsOptional() @IsBoolean() is_listed_on_ebay?: boolean;
  @IsOptional() @IsBoolean() is_offer_enabled?: boolean;
  @IsOptional() @IsBoolean() is_campaign_enabled?: boolean;

  // Financeiro
  @IsOptional() @IsNumber() ebay_fee_percent?: number;
  @IsOptional() @IsBoolean() use_custom_fee_percent?: boolean;
  @IsOptional() @IsNumber() custom_fee_percent?: number;
  @IsOptional() @IsNumber() ebay_fees_usd?: number;
  @IsOptional() @IsNumber() sale_value_usd?: number;
  @IsOptional() @IsNumber() exchange_rate?: number;
  @IsOptional() @IsNumber() received_brl?: number;
  @IsOptional() @IsNumber() item_profit_brl?: number;
}
