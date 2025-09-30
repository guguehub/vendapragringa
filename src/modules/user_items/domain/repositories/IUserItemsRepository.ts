// src/modules/user_items/domain/repositories/IUserItemsRepository.ts
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';
import { ICreateUserItemDTO } from '../../dtos/ICreateUserItemDTO';

export default interface IUserItemsRepository {
  create(data: ICreateUserItemDTO): Promise<UserItem>;
  save(userItem: UserItem): Promise<UserItem>;

  findById(id: string): Promise<UserItem | null>;
  findByUserId(user_id: string): Promise<UserItem[]>;
  findByUserAndItem(user_id: string, item_id: string): Promise<UserItem | null>;
  findByIdAndUser(id: string, user_id: string): Promise<UserItem | null>;
  listByUser(user_id: string): Promise<UserItem[]>;

  update(userItem: UserItem): Promise<UserItem>;
  delete(id: string): Promise<void>;
  remove(userItem: UserItem): Promise<void>;

  show(id: string): Promise<UserItem | null>;
}
