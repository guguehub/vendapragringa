// src/modules/saved-items/infra/typeorm/repositories/SavedItemsRepository.ts
import { Repository, DataSource } from 'typeorm';
import { ISavedItemsRepository } from '@modules/saved-items/domain/repositories/ISavedItemsRepository';

import { SavedItem } from '../entities/SavedItem';
import { ICreateSavedItem } from '@modules/saved-items/domain/interfaces/ICreateSavedItem';
import { injectable } from 'tsyringe';
import AppDataSource from '@shared/infra/typeorm/data-source'

@injectable()
export class SavedItemsRepository implements ISavedItemsRepository {
  private ormRepository: Repository<SavedItem>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(SavedItem);
  }

  public async create(data: ICreateSavedItem): Promise<SavedItem> {
    const savedItem = this.ormRepository.create(data);
    await this.ormRepository.save(savedItem);
    return savedItem;
  }

  public async findByUserId(user_id: string): Promise<SavedItem[]> {
    return this.ormRepository.find({
      where: { user_id },
      relations: ['item'], // se quiser retornar os dados do item relacionado
    });
  }

  public async findByUserIdAndItemId(
    user_id: string,
    item_id: string,
  ): Promise<SavedItem | null> {
    return this.ormRepository.findOne({ where: { user_id, item_id } });
  }

  public async countByUserId(user_id: string): Promise<number> {
    return this.ormRepository.count({ where: { user_id } });
  }

  public async deleteByUserIdAndItemId(
    user_id: string,
    item_id: string,
  ): Promise<void> {
    await this.ormRepository.delete({ user_id, item_id });
  }
}
