// src/modules/user_items/services/ShowUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

@injectable()
class ShowUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string, user_id: string): Promise<IUserItem> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, user_id);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    return userItem;
  }
}

export default ShowUserItemService;
