import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';

import AppDataSource from '@shared/infra/typeorm/data-source';
import IUserItemsRepository from '@modules/user_items/domain/repositories/IUserItemsRepository';
import { ICreateUserItemDTO } from '@modules/user_items/dtos/ICreateUserItemDTO';
import UserItem from '../entities/UserItems';

@injectable()
class UserItemsRepository implements IUserItemsRepository {
  private ormRepository: Repository<UserItem>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserItem);
  }

  public async create(data: ICreateUserItemDTO): Promise<UserItem> {
    // mapeia camelCase
    const mappedData = {
      ...data,
      userId: data.user_id,
      itemId: data.item_id,
      snapshotImages: Array.isArray(data.snapshotImages)
        ? JSON.stringify(data.snapshotImages)
        : data.snapshotImages,
    };
    const userItem = this.ormRepository.create(mappedData);
    return this.ormRepository.save(userItem);
  }

  public async save(userItem: UserItem): Promise<UserItem> {
    return this.ormRepository.save(userItem);
  }

  public async update(userItem: UserItem): Promise<UserItem> {
    return this.ormRepository.save(userItem);
  }

  public async findById(id: string): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['item'],
    });
  }

  public async findByUserId(userId: string): Promise<UserItem[]> {
    return this.ormRepository.find({
      where: { userId },
      relations: ['item'],
    });
  }

  public async findByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { userId, itemId },
      relations: ['item'],
    });
  }

  public async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { id, userId },
      relations: ['item'],
    });
  }

  public async listByUser(userId: string): Promise<UserItem[]> {
    return this.findByUserId(userId);
  }

  public async show(id: string): Promise<UserItem | null> {
    return this.findById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async remove(userItem: UserItem): Promise<void> {
    await this.ormRepository.remove(userItem);
  }
}

export default UserItemsRepository;
