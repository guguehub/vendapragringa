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

  public async execute(id: string): Promise<IUserItem> {
    const userItem = await this.userItemsRepository.findById(id);

    if (!userItem) {
      throw new AppError('User item not found.');
    }

    return userItem;
  }
}

export default ShowUserItemService;
