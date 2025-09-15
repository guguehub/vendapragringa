// src/modules/user_items/infra/http/controllers/UserItemsController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserItemService from '@modules/user_items/services/CreateUserItemService';
import ListUserItemsService from '@modules/user_items/services/ListUserItemsService';
import ShowUserItemService from '@modules/user_items/services/ShowUserItemService';
import UpdateUserItemService from '@modules/user_items/services/UpdateUserItemService';
import DeleteUserItemService from '@modules/user_items/services/DeleteUserItemService';

import AppError from '@shared/errors/AppError';

export default class UserItemsController {
  // Listar todos os itens do usuário logado
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listService = container.resolve(ListUserItemsService);
    const items = await listService.execute(user_id);

    return response.json(items);
  }

  // Mostrar um item específico do usuário logado
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;

    const showService = container.resolve(ShowUserItemService);
    const item = await showService.execute(id, user_id);

    if (!item) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    return response.json(item);
  }

  // Criar novo item vinculado ao usuário logado
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

  // Atualizar item do usuário logado
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;
    const data = request.body;

    const updateService = container.resolve(UpdateUserItemService);
    const updated = await updateService.execute(id, user_id, data);

    if (!updated) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    return response.json(updated);
  }

  // Deletar item do usuário logado
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;

    const deleteService = container.resolve(DeleteUserItemService);
    const deleted = await deleteService.execute(id, user_id);

    if (!deleted) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    return response.status(204).send();
  }
}
