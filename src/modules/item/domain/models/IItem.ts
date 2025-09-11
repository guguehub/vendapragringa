import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { ItemStatus } from '../enums/item-status.enum';

export interface IItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  externalId?: string;
  marketplace?: string;           // ex: "mercadolivre", "olx"
  shippingPrice?: number;
  status: ItemStatus;              // <--- agora usa enum
  itemLink?: string;
  lastScrapedAt?: Date;
  images?: string[];               // JSON string convertida para array de URLs
  importStage: 'draft' | string;   // mantém possibilidade de outros estágios
  isDraft: boolean;
  isSynced: boolean;
  supplier?: ISupplier;            // relação opcional
  createdBy: string;               // obrigatório, default: 'system'
  created_at: Date;
  updated_at: Date;
}
