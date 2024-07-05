import {
  EntityRepository,
  FindManyOptions,
  getRepository,
  Repository,
} from 'typeorm';
import Order from '../entities/Order';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}
interface IRequest {
  customer: Customer;
  products: IProduct[];
}

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;
  constructor() {
    this.ormRepository = getRepository(Order);
  }
  product_id: string;
  price: number;
  quantity: number;

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });
    return order;
  }
  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);
    return order;
  }
}

export default OrdersRepository;
