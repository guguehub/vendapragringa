import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListItemService from '@modules/item/services/ListItemService';
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

    // ShowItemService espera string, não { id }
    const item = await showItem.execute(id);

    return response.json(item);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    if (!request.user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const userId = request.user.id;

    const {
      title,
      description,
      price,
      shippingPrice,
      status,
      itemStatus,
      soldCount,
      condition,
      externalId,
      marketplace,
      itemLink,
      images,
      isDraft,
      isSynced,
      supplierId,
    } = request.body;

    const createItem = container.resolve(CreateItemService);

    const item = await createItem.execute(userId, {
      title,
      description,
      price,
      shippingPrice,
      status,
      itemStatus,
      soldCount,
      condition,
      external_id: externalId, // snake_case
      marketplace,
      itemLink,
      images,
      is_draft: isDraft,       // snake_case
      is_synced: isSynced,     // snake_case
      supplierId,
    });

    return response.status(201).json(item);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    if (!request.user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = request.params;

    const {
      title,
      description,
      price,
      shippingPrice,
      status,
      itemStatus,
      soldCount,
      condition,
      externalId,
      marketplace,
      itemLink,
      images,
      isDraft,
      isSynced,
      supplierId,
    } = request.body;

    const updateItem = container.resolve(UpdateItemService);

    const item = await updateItem.execute({
      id,
      title,
      description,
      price,
      shippingPrice,
      status,
      itemStatus,
      soldCount,
      condition,
      external_id: externalId, // snake_case
      marketplace,
      itemLink,
      images,
      is_draft: isDraft,       // snake_case
      is_synced: isSynced,     // snake_case
      supplierId,
    });

    return response.json(item);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteItem = container.resolve(DeleteItemService);

    await deleteItem.execute({ id }); // depende da assinatura, mas deixo { id }

    return response.status(204).send();
  }
}
