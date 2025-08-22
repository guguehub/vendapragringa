export interface IUserItem {
  id: string;
  userId: string;
  itemId: string;
  import_stage: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';
  notes?: string;

  // Finance
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;

  // Metadata
  created_at: Date;
  updated_at: Date;

  // Relacionamentos opcionais
  user?: { id: string; name: string };
  item?: { id: string; title: string };
}
