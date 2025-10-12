export interface ICreateUserItemDTO {
  user_id: string;
  item_id: string;
  quantity?: number;
  notes?: string;

  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';

  // Snapshot
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string[]; // corrigido: remover string | string[]
  snapshotMarketplace?: string;
  snapshotExternalId?: string;

  // eBay
  ebay_title?: string;
  ebay_link?: string;
  ebay_price?: number;
  ebay_shipping_weight_grams?: number;
  is_listed_on_ebay?: boolean;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;

  // Financeiro
  offerAmount?: number;
  campaignPercent?: number;
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
}
