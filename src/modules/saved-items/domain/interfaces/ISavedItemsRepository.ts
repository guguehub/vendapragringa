// src/modules/saved-items/domain/repositories/ISavedItemsRepository.ts
import { SavedItem } from '@modules/saved-items/infra/typeorm/entities/SavedItem';
import { ICreateSavedItem } from './ICreateSavedItem';


export interface ISavedItemsRepository {
  create(data: ICreateSavedItem): Promise<SavedItem>;
  findByUserId(user_id: string): Promise<SavedItem[]>;
  findByUserIdAndItemId(
    user_id: string,
    item_id: string,
  ): Promise<SavedItem | null>;
  countByUserId(user_id: string): Promise<number>;
  deleteByUserIdAndItemId(user_id: string, item_id: string): Promise<void>;
}
