export interface ICreateUserItem {
  user_id: string;
  item_id: string;

  // eBay specifics
  ebay_title?: string;
  ebay_price_usd?: number;
  is_listed_on_ebay?: boolean;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;
  ebay_shipping_weight_grams?: number;

  // Finance / Controle
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
  profit_estimate_brl?: number;
  notes?: string;

  sync_status?: 'active' | 'paused' | 'sold_out';
  is_draft?: boolean;
  is_synced?: boolean;

  user_created_id?: string;
  user_updated_id?: string;
}
