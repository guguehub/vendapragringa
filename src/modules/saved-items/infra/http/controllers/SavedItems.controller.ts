import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListSavedItemsService from '@modules/item/services/ListSavedItemsService';
import CreateSavedItemService from '@modules/item/services/CreateSavedItemService';
import DeleteSavedItemService from '@modules/item/services/DeleteSavedItemService';

export default class SavedItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listSavedItems = container.resolve(ListSavedItemsService);

    const items = await listSavedItems.execute({ user_id });

    return response.json(items);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { item_id } = request.body;

    const createSavedItem = container.resolve(CreateSavedItemService);

    const savedItem = await createSavedItem.execute({ user_id, item_id });

    return response.json(savedItem);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;

    const deleteSavedItem = container.resolve(DeleteSavedItemService);

    await deleteSavedItem.execute({ id, user_id });

    return response.status(204).send();
  }
}
