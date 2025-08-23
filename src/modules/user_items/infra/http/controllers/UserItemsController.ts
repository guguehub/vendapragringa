import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserItemService from '@modules/user_items/services/CreateUserItemService';
import ListUserItemsService from '@modules/user_items/services/ListUserItemsService';
import ShowUserItemService from '@modules/user_items/services/ShowUserItemService';
import UpdateUserItemService from '@modules/user_items/services/UpdateUserItemService';
import DeleteUserItemService from '@modules/user_items/services/DeleteUserItemService';

export default class UserItemsController {
  // Listar todos os itens do usuário
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listService = container.resolve(ListUserItemsService);
    const items = await listService.execute(user_id);

    return response.json(items);
  }

  // Mostrar um item específico
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showService = container.resolve(ShowUserItemService);
    const item = await showService.execute(id);

    return response.json(item);
  }

  // Criar novo item
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { item_id, quantity } = request.body;

    const createService = container.resolve(CreateUserItemService);
    const userItem = await createService.execute({
      user_id,
      item_id,
      quantity,
    });

    return response.status(201).json(userItem);
  }

  // Atualizar item
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const updateService = container.resolve(UpdateUserItemService);
    const updated = await updateService.execute(id, data);

    return response.json(updated);
  }

  // Deletar item
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteService = container.resolve(DeleteUserItemService);
    await deleteService.execute(id);

    return response.status(204).send();
  }
}
