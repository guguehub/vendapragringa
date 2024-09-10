import { ICreateOrder } from '../models/ICreateOrder';
import { IOrder } from '../models/IOrder';
import { IOrderPaginate } from '../models/IOrderPaginate';

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface IOrdersRepository {
  findById(id: string): Promise<IOrder | null>;
  //createOrder({ customer, products }: ICreateOrder): Promise<IOrder>;
  create(data: ICreateOrder): Promise<IOrder>;
  findAll(): Promise<IOrder[] | undefined>;
  //findAll({ page, skip, take }: SearchParams): Promise<IOrderPaginate>;
  remove(order: IOrder): Promise<void>;
}
