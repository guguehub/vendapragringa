// src/modules/saved-items/infra/http/controllers/SavedItemsController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSavedItemService from '@modules/saved-items/services/CreateSavedItemService';
import ListSavedItemsService from '@modules/saved-items/services/ListSavedItemsService';
import DeleteSavedItemService from '@modules/saved-items/services/DeleteSavedItemService';

export default class SavedItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listSavedItems = container.resolve(ListSavedItemsService);
    const savedItems = await listSavedItems.execute({ user_id });

    return response.json(savedItems);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { item_id } = request.body;

    const createSavedItem = container.resolve(CreateSavedItemService);
    const savedItem = await createSavedItem.execute({ user_id, item_id });

    return response.status(201).json(savedItem);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { item_id } = request.params;

    const deleteSavedItem = container.resolve(DeleteSavedItemService);
    await deleteSavedItem.execute({ user_id, item_id });

    return response.status(204).send();
  }
}
