export interface IUpdateItem {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  itemStatus?: string;
  soldCount?: number;
  condition?: string;
  shippingPrice?: number;
  status?: string;
  externalId?: string;   // camelCase
  marketplace?: string;
  itemLink?: string;
  images?: string[];
  isDraft?: boolean;
  isSynced?: boolean;
}
