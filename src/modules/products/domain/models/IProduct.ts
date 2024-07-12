import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  order_products: OrdersProducts[];
  quantity: number;
  created_at: Date;
  updated_at: Date;
}
