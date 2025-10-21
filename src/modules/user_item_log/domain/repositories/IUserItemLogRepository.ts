import { IUserItemLog } from '../models/IUserItemLog';

export interface IUserItemLogRepository {
  create(log: IUserItemLog): Promise<IUserItemLog>;
  listByUserItemId(user_item_id: string): Promise<IUserItemLog[]>;
  countUniqueUsers(user_item_id: string): Promise<number>;
}