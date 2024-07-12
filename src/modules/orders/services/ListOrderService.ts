import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { inject, injectable } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import { IOrder } from '../domain/models/IOrder';
import redisCache from '../../../shared/cache/RedisCache';
import { IOrderPaginate } from '../domain/models/IOrderPaginate';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute(): Promise<IOrder[] | undefined> {
    const orders = await this.ordersRepository.findAll();

    return orders;
  }
}

export default ListOrderService;
