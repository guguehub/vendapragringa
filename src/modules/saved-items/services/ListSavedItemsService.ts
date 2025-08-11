// src/modules/saved-items/services/ListSavedItemsService.ts
import { inject, injectable } from 'tsyringe';
import { ISavedItemsRepository } from '../domain/repositories/ISavedItemsRepository';
import { SavedItem } from '../infra/typeorm/entities/SavedItem';

interface IRequest {
  user_id: string;
}

@injectable()
class ListSavedItemsService {
  constructor(
    @inject('SavedItemsRepository')
    private savedItemsRepository: ISavedItemsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<SavedItem[]> {
    const savedItems = await this.savedItemsRepository.findByUserId(user_id);
    return savedItems;
  }
}

export default ListSavedItemsService;
