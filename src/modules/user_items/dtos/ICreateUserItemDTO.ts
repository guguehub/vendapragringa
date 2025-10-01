// src/modules/user_items/dtos/ICreateUserItemDTO.ts
export interface ICreateUserItemDTO {
  // identificação
  user_id: string;
  item_id: string;

  // controle básico
  quantity?: number;
  notes?: string;

  // import / controle
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';

  // ----- Snapshot do Item (opcionais: se não vier, o service irá preencher a partir do Item) -----
  snapshotTitle?: string;
  snapshotPrice?: number;
  // pode aceitar array (string[]) no controller; aqui salvamos como string JSON.
  snapshotImages?: string | string[];
  snapshotMarketplace?: string;
  snapshotExternalId?: string;

  // ----- eBay specific (opcionais) -----
  ebay_title?: string;
  ebay_link?: string;
  ebay_price?: number;
  ebay_shipping_weight_grams?: number;
  is_listed_on_ebay?: boolean;
  is_offer_enabled?: boolean;
  is_campaign_enabled?: boolean;

  // ----- Financeiro/Custom -----
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
}
