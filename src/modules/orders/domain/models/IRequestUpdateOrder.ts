import { IProduct } from '@modules/products/domain/models/IProduct';

export interface IRequestUpdateOrder {
  //customer_id: string;
  products: IProduct[];
  quantity: number;
}
