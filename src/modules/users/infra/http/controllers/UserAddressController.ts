import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserAddressService from '@modules/users/services/UserAddressService';
import AppError from '@shared/errors/AppError';

export default class UserAddressController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // obtido via middleware de autenticação
    const data = { ...request.body, user_id };

    const service = container.resolve(UserAddressService);
    const address = await service.create(data);

    return response.status(201).json(address);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const service = container.resolve(UserAddressService);
    const updated = await service.update(id, data);

    return response.json(updated);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(UserAddressService);
    const addresses = await service.listByUser(user_id);

    return response.json(addresses);
  }

  public async getPrimary(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(UserAddressService);
    const address = await service.getPrimary(user_id);

    if (!address) {
      throw new AppError('Nenhum endereço principal encontrado.', 404);
    }

    return response.json(address);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const service = container.resolve(UserAddressService);
    await service.delete(id);

    return response.status(204).send();
  }
}
