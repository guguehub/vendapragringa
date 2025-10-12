export interface IUpdateUserItemDTO {
  id: string;
  quantity?: number;
  notes?: string;

  // Snapshot
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string[];
  snapshotMarketplace?: string;
  snapshotExternalId?: string;

  // eBay / Promoção
  ebay_title?: string;
  ebay_link?: string;
  ebay_price?: number;
  ebay_shipping_weight_grams?: number;
  is_listed_on_ebay?: boolean;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;
  offerAmount?: number;
  campaignPercent?: number;

  // Financeiro
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;

  // Controle
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';
}
