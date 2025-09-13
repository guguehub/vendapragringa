export interface ICreateProduct {
  product_title: string;
  description?: string;
  price: number;
  is_active?: boolean;
  product_url?: undefined;
  image_url?: undefined;
  payment_method?: undefined;
  category?: string;
  tags?: string[];
  published_at?: Date;
  expiration_date?: Date | null;
}
