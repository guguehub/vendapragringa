// src/modules/saved-items/services/DeleteSavedItemService.ts
import { inject, injectable } from 'tsyringe';
import { ISavedItemsRepository } from '../domain/repositories/ISavedItemsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  item_id: string;
}

@injectable()
class DeleteSavedItemService {
  constructor(
    @inject('SavedItemsRepository')
    private savedItemsRepository: ISavedItemsRepository,
  ) {}

  public async execute({ user_id, item_id }: IRequest): Promise<void> {
    const savedItem = await this.savedItemsRepository.findByUserIdAndItemId(
      user_id,
      item_id,
    );

    if (!savedItem) {
      throw new AppError('Item salvo não encontrado.', 404);
    }

    await this.savedItemsRepository.deleteByUserIdAndItemId(user_id, item_id);
  }
}

export default DeleteSavedItemService;
