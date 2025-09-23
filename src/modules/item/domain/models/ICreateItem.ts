export interface ICreateItem {
  title: string;
  price: number;
  description?: string;
  external_id?: string;
  marketplace?: string;           // "mercadolivre" | "olx" | ...
  shippingPrice?: number;
  status?: string;                // "ready" | "listed" | "sold"
  supplierId?: string;
  itemStatus?: string;            // status do anúncio (raspagem ML)
  soldCount?: number;             // quantidade vendida
  condition?: string;             // novo | usado

  itemLink?: string;
  importStage?: string;           // ex: "draft"
  images?: string[];              // array direto no DTO

  last_scraped_at?: Date;
  is_draft?: boolean;
  is_synced?: boolean;

  created_by?: string;
}
