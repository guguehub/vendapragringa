// src/modules/saved-items/services/CreateSavedItemService.ts
import { inject, injectable } from 'tsyringe';
import { ISavedItemsRepository } from '../domain/repositories/ISavedItemsRepository';

import AppError from '@shared/errors/AppError';
import { ICreateSavedItem } from '../domain/interfaces/ICreateSavedItem';

@injectable()
class CreateSavedItemService {
  constructor(
    @inject('SavedItemsRepository')
    private savedItemsRepository: ISavedItemsRepository,
  ) {}

  public async execute({
    user_id,
    item_id,
  }: ICreateSavedItem) {
    // Verifica se já está salvo
    const existingSavedItem = await this.savedItemsRepository.findByUserIdAndItemId(
      user_id,
      item_id,
    );

    if (existingSavedItem) {
      throw new AppError('Este item já está salvo.');
    }

    // Cria o registro de SavedItem
    const savedItem = await this.savedItemsRepository.create({
      user_id,
      item_id,
    });

    return savedItem;
  }
}

export default CreateSavedItemService;
