import { getRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IOrder } from '@modules/orders/domain/models/IOrder';
import { IDeleteOrder } from '@modules/orders/domain/models/IDeleteOrder';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;
  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });
    return order;
  }

  public async findAll(): Promise<IOrder[] | undefined> {
    const orders = await this.ormRepository.find({
      relations: ['order_products', 'customer'],
    });
    return orders;
  }

  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });
    await this.ormRepository.save(order);

    return order;
  }
  public async remove(order: Order): Promise<void | undefined> {
    await this.ormRepository.remove(order);
  }
}

export default OrdersRepository;
