import { ICustomer } from '@modules/customers/domain/models/iCustomer';
import { ICreateOrderProducts } from './ICreateOrderProducts';

export interface IOrder {
  id: string;
  customer: ICustomer;
  order_products: ICreateOrderProducts[];
  created_at: Date;
  updated_at: Date;
}
