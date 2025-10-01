import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';
import UserItem from '../infra/typeorm/entities/UserItems';

@injectable()
class ShowUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<UserItem> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, userId);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    return userItem;
  }
}

export default ShowUserItemService;
