// src/modules/item/domain/models/ICreateItem.ts
export interface ICreateItem {
  title: string;
  price: number;
  description?: string;
  external_id?: string;
  marketplace?: string;
  shipping_price?: number;
  status?: string; // será convertido para ItemStatus no service
  supplierId?: string;

  last_scraped_at?: Date;
  is_draft?: boolean;
  is_synced?: boolean;

  created_by?: string; // vincula ao usuário dono do item
}
