// src/modules/user_items/domain/models/ICreateUserItem.ts
export interface ICreateUserItem {
  user_id: string;
  item_id: string;
  quantity?: number;
  notes?: string;

  // Snapshot do Item
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string[];
  snapshotMarketplace?: string;
  snapshotExternalId?: string;

  // eBay Specific
  ebay_title?: string;
  ebay_link?: string;
  ebay_price?: number;
  ebay_shipping_weight_grams?: number;
  is_listed_on_ebay?: boolean;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;

  // Finance Custom
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
  offerAmount?: number;
  campaignPercent?: number;

  // Controle
  sync_status?: 'active' | 'paused' | 'sold_out';
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
}
