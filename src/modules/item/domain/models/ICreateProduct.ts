export interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
  listingUrl: string;
  mercadoLivreItemId: string;
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
  expirationDate?: Date;
  marketplace: string;
  itemType: string;
}
