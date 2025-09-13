export interface IProduct {
  id: string;
  product_title: string;
  description?: string;
  price: number;
  is_active: boolean;
  product_url?: string;
  image_url?: string;
  payment_method?: string;
  category?: string;
  tags?: string[];
  published_at: Date;
  expiration_date?: Date | null;
  created_at: Date;
  updated_at: Date;
}
