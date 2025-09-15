// src/modules/user_items/services/DeleteUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';

@injectable()
class DeleteUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string, user_id: string): Promise<void> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, user_id);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    await this.userItemsRepository.delete(id);
  }
}

export default DeleteUserItemService;
