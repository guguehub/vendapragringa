// src/modules/user_items/domain/repositories/IUserItemsRepository.ts
import { IUserItem } from '../models/IUserItem';
import { ICreateUserItemDTO } from '../../dtos/ICreateUserItemDTO';

export interface IUserItemsRepository {
  create(data: ICreateUserItemDTO): Promise<IUserItem>;
  save(userItem: IUserItem): Promise<IUserItem>; // ✅ adicionado
  delete(id: string): Promise<void>;
  findById(id: string): Promise<IUserItem | null>;
  findByUserAndItem(user_id: string, item_id: string): Promise<IUserItem | null>;
  listByUser(user_id: string): Promise<IUserItem[]>;
  update(id: string, data: Partial<IUserItem>): Promise<IUserItem>;
  show(id: string): Promise<IUserItem | null>;
}
