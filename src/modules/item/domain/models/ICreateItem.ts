export interface ICreateItem {
  title: string;
  price: number;
  description?: string;
  externalId?: string;        // camelCase
  marketplace?: string;
  shippingPrice?: number;
  status?: string;
  supplierId?: string;
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
