export interface IUpdateUserItem {
  id: string;
  price?: number;
  quantity?: number;
  active?: boolean;
  notes?: string;
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';
}
