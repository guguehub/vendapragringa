import { SavedItem } from '@modules/saved-items/infra/typeorm/entities/SavedItem';
import { ICreateSavedItem } from '../interfaces/ICreateSavedItem';

export interface ISavedItemsRepository {
  create(data: ICreateSavedItem): Promise<SavedItem>;
  countByUserId(userId: string): Promise<number>;
  findByUserId(userId: string): Promise<SavedItem[]>;
  //favorite methods
  findByUserIdAndItemId(user_id: string, item_id: string): Promise<SavedItem | null>;
deleteByUserIdAndItemId(user_id: string, item_id: string): Promise<void>;
}


