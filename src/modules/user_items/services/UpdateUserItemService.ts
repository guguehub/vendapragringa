import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';
import { IUpdateUserItemDTO } from '../dtos/IUpdateUserItemDTO';

@injectable()
class UpdateUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(
    id: string,
    data: IUpdateUserItemDTO,
  ): Promise<IUserItem> {
    const userItem = await this.userItemsRepository.findById(id);

    if (!userItem) {
      throw new AppError('User item not found.');
    }

    const updated = await this.userItemsRepository.update(id, data);
    return updated;
  }
}

export default UpdateUserItemService;
