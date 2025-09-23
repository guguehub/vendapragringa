import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { ItemStatus } from '../enums/item-status.enum';

export interface IItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  externalId?: string;
  marketplace?: string;            // ex: "mercadolivre", "olx"
  condition?: string;              // novo campo
  soldCount?: number;              // novo campo
  shippingPrice?: number;
  status: ItemStatus;              // enum: ready | listed | sold
  itemStatus?: string;             // novo campo (status do marketplace)
  itemLink?: string;
  lastScrapedAt?: Date;
  images?: string[];               // JSON string convertida para array
  importStage: 'draft' | string;   // mantém flexibilidade para outros estágios
  isDraft: boolean;
  isSynced: boolean;
  supplier?: ISupplier;            // relação opcional
  createdBy: string;               // obrigatório, default: 'system'
  created_at: Date;
  updated_at: Date;
}
