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

  public async findById(id: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<IUserItem | null> {
    return this.ormRepository.findOne({ where: { userId, itemId } });
  }

  public async listByUser(userId: string): Promise<IUserItem[]> {
    return this.ormRepository.find({
      where: { userId },
      relations: ['item'],
    });
  }

  public async update(id: string, data: Partial<IUserItem>): Promise<IUserItem> {
    await this.ormRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('UserItem não encontrado após update');
    return updated;
  }

  public async show(id: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  public async findByIdAndUser(id: string, userId: string): Promise<IUserItem | null> {
    return this.ormRepository.findOne({
      where: { id, userId },
    });
  }
}
