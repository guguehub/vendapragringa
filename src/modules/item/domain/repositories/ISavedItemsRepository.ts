import { SavedItem } from '@modules/item/infra/typeorm/entities/SavedItem';
import { ICreateSavedItem } from '../models/ICreateSavedItem';

export interface ISavedItemsRepository {
  create(data: ICreateSavedItem & { user_id: string }): Promise<SavedItem>;
  countByUserId(userId: string): Promise<number>;
}
