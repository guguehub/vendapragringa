import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  order_products: OrdersProducts[];
  quantity: number;
  created_at: Date;
  updated_at: Date;
  listingUrl: string;
  mercadoLivreItemId: string; // Mercado Livre item ID
  description: string;
  shippingPrice: number;
  status: string;
  condition: string;
  availableQuantity: number;
  sellerId: string;
  categoryId: string;
  images: string[];
  currency: string;
  publishedAt: Date;
  expirationDate: Date | null;
  marketplace: string; // Marketplace of the listing
  itemType: string; // New, used, etc.
}
