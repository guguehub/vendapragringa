import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';

@injectable()
class DeleteUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const userItem = await this.userItemsRepository.findById(id);

    if (!userItem) {
      throw new AppError('User item not found.');
    }

    await this.userItemsRepository.delete(id);
  }
}

export default DeleteUserItemService;
