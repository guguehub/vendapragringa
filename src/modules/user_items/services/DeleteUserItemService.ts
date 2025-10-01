import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';

@injectable()
class DeleteUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, userId);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    await this.userItemsRepository.delete(userItem.id);
  }
}

export default DeleteUserItemService;
