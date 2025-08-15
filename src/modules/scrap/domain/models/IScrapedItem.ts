export interface IScrapedItem {
  title: string | null;
  price: string | null;
  description: string | null;
  shippingInfo: string | null;
  itemStatus: string;
  url: string;
  itemId: string | null;
  errorDetails?: string;
}
