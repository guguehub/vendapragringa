export interface ICreateItem {
  name: string;
  price: number;
  description?: string;
  external_id?: string;
  marketplace?: string;
  shipping_price?: number;
  status?: string;

  user_id: string;
  supplierId?: string;

  is_listed_on_ebay?: boolean;
  ebay_title?: string;
  ebay_offer_value_usd?: number;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;
  ebay_shipping_weight_grams?: number;

  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
  ml_shipping_cost_brl?: number;

  is_draft?: boolean;
  is_synced?: boolean;

  user_created_id?: string;
  user_updated_id?: string;
}
