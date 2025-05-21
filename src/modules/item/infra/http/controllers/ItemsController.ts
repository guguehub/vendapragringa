import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListItemService from '@modules/item/infra/services/ListItemService';
import ShowItemService from '@modules/item/services/ShowItemService';
import CreateItemService from '@modules/item/services/CreateItemService';
import UpdateItemService from '@modules/item/services/UpdateItemService';
import DeleteItemService from '@modules/item/services/DeleteItemService';

export default class ItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listItems = container.resolve(ListItemService);

    const items = await listItems.execute();

    return response.json(items);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showItem = container.resolve(ShowItemService);

    const item = await showItem.execute({ id });

    return response.json(item);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, price, quantity } = request.body;

    const createItem = container.resolve(CreateItemService);

    const item = await createItem.execute({
      name,
      description,
      price,
      quantity,
    });

    return response.json(item);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, description, price, quantity } = request.body;
    const { id } = request.params;

    const updateItem = container.resolve(UpdateItemService);

    const item = await updateItem.execute({
      id,
      name,
      description,
      price,
      quantity,
    });

    return response.json(item);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteItem = container.resolve(DeleteItemService);

    await deleteItem.execute({ id });

    return response.status(204).send();
  }
}
