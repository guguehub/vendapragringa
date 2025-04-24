import { Repository, DataSource } from 'typeorm';
import { ISavedItemsRepository } from '@modules/item/domain/repositories/ISavedItemsRepository';
import { ICreateSavedItem } from '@modules/item/domain/models/ICreateSavedItem';
import { SavedItem } from '../entities/SavedItem';

export class SavedItemsRepository implements ISavedItemsRepository {
  private ormRepository: Repository<SavedItem>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(SavedItem);
  }

  public async create(data: ICreateSavedItem): Promise<SavedItem> {
    const item = this.ormRepository.create(data);
    await this.ormRepository.save(item);
    return item;
  }

  public async countByUserId(user_id: string): Promise<number> {
    return this.ormRepository.count({ where: { user_id } });
  }

  public async findByUserId(user_id: string): Promise<SavedItem[]> {
    return this.ormRepository.find({ where: { user_id } });
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
