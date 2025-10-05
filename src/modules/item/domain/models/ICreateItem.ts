import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';

export interface ICreateItem {
  title: string;
  price: number;
  description?: string;
  externalId?: string;        // camelCase
  marketplace?: string;
  shippingPrice?: number;
  status?: string;
  supplierId?: string;
  supplier?: Supplier;        // ✅ permite passar o objeto Supplier ao criar
  itemStatus?: string;
  soldCount?: number;
  condition?: string;
  itemLink?: string;
  importStage?: string;       // default 'draft'
  images?: string[];
  lastScrapedAt?: Date;
  isDraft?: boolean;
  isSynced?: boolean;
  createdBy?: string;
}
