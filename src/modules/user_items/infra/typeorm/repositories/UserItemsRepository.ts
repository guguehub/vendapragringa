// src/modules/user_items/infra/typeorm/repositories/UserItemsRepository.ts
import { Repository, DataSource } from 'typeorm';
import { IUserItemsRepository } from '@modules/user_items/domain/repositories/IUserItemsRepository';
import { IUserItem } from '@modules/user_items/domain/models/IUserItem';
import { ICreateUserItemDTO } from '@modules/user_items/dtos/ICreateUserItemDTO';
import UserItem from '../entities/UserItems';

export class UserItemsRepository implements IUserItemsRepository {
  private ormRepository: Repository<UserItem>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(UserItem);
  }

  public async create(data: ICreateUserItemDTO): Promise<IUserItem> {
    const userItem = this.ormRepository.create(data);
    await this.ormRepository.save(userItem);
    return userItem;
  }

  public async save(userItem: IUserItem): Promise<IUserItem> {
    return this.ormRepository.save(userItem);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async remove(userItem: IUserItem): Promise<void> {
    await this.ormRepository.remove(userItem as UserItem);
  }

  public async findById(id: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByUserAndItem(
    user_id: string,
    item_id: string,
  ): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { userId: user_id, itemId: item_id } });
  }

  public async findByIdAndUser(id: string, user_id: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { id, userId: user_id } });
  }

  public async listByUser(user_id: string): Promise<IUserItem[]> {
    return this.ormRepository.find({ where: { userId: user_id }, relations: ['item'] });
  }

  public async update(id: string, data: Partial<IUserItem>): Promise<IUserItem> {
    await this.ormRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('UserItem não encontrado após update');
    return updated;
  }

  public async show(id: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { id }, relations: ['item', 'user'] });
  }
}
