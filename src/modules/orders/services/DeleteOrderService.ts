import { inject, injectable } from 'tsyringe';
import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { IDeleteOrder } from '../domain/models/IDeleteOrder';

@injectable()
class DeleteOrderService {
  constructor(
    @inject('OrdersRepository')
    private OrdersRepository: IOrdersRepository,
  ) {}

  public async execute({ id }: IDeleteOrder): Promise<void> {
    const order = await this.OrdersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found...sorry');
    }
    await RedisCache.invalidate('api-vendas-ORDER-LIST');
    await this.OrdersRepository.remove(order);
  }
}
export default DeleteOrderService;
