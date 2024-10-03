import { Request, Response } from 'express';
import ShowOrderService from '../../../services/ShowOrderService';
import CreateOrderService from '../../../services/CreateOrderService';
import { container } from 'tsyringe';
import ListOrderService from '@modules/orders/services/ListOrderService';
import { IOrder } from '@modules/orders/domain/models/IOrder';
import DeleteOrderService from '@modules/orders/services/DeleteOrderService';
import UpdateOrderService from '@modules/orders/services/UpdateOrderService';

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const listOrders = container.resolve(ListOrderService);

    const orders = await listOrders.execute();

    return response.json(orders);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });
    return response.json(order);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteOrder = container.resolve(DeleteOrderService);

    await deleteOrder.execute({ id });

    return response.json([console.log('pedido deletado')]);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { products, quantity } = request.body;

    const updateOrder = container.resolve(UpdateOrderService);

    await updateOrder.execute({ products, quantity });

    return response.json();
  }
}
