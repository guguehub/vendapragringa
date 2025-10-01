// src/modules/user_items/domain/models/IUpdateUserItem.ts
export interface IUpdateUserItem {
  id: string;
  quantity?: number;
  notes?: string;

  // Snapshot
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string[];

  // Controle
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';
}
