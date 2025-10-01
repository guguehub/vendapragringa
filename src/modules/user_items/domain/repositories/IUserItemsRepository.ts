import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';
import { ICreateUserItemDTO } from '../../dtos/ICreateUserItemDTO';

export default interface IUserItemsRepository {
  create(data: ICreateUserItemDTO): Promise<UserItem>;
  save(userItem: UserItem): Promise<UserItem>;
  update(userItem: UserItem): Promise<UserItem>;

  findById(id: string): Promise<UserItem | null>;
  findByUserId(userId: string): Promise<UserItem[]>;
  findByUserAndItem(userId: string, itemId: string): Promise<UserItem | null>;
  findByIdAndUser(id: string, userId: string): Promise<UserItem | null>;
  listByUser(userId: string): Promise<UserItem[]>;

  delete(id: string): Promise<void>;
  remove(userItem: UserItem): Promise<void>;
  show(id: string): Promise<UserItem | null>;
}
