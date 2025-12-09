export interface IScrapedItem {
  title: string | null;
  price: string | null;
  description: string | null;
  shippingInfo: string | null;
  itemStatus: string;
  url: string;
  itemId: string | null;
  errorDetails?: string;

  // 🔹 Campos adicionais opcionais (sem erro se ausentes)
  marketplace?: string;
  condition?: string;
  shippingPrice?: number | null;
  soldCount?: number | null;
  images?: string[] | null;
}
