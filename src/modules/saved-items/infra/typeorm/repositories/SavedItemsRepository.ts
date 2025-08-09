import { Repository, DataSource } from 'typeorm';
import { ISavedItemsRepository } from '@modules/saved-items/domain/repositories/ISavedItemsRepository';
import { SavedItem } from '../../../../item/infra/typeorm/entities/SavedItem';

export class SavedItemsRepository implements ISavedItemsRepository {
  private ormRepository: Repository<SavedItem>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(SavedItem);
  }

  public async create({ user_id, item_id }: { user_id: string; item_id: string }): Promise<SavedItem> {
    const savedItem = this.ormRepository.create({ user_id, item_id });
    await this.ormRepository.save(savedItem);
    return savedItem;
  }

  public async countByUserId(user_id: string): Promise<number> {
    return this.ormRepository.count({ where: { user_id } });
  }

  public async findByUserId(user_id: string): Promise<SavedItem[]> {
    return this.ormRepository.find({ where: { user_id }, relations: ['item'] });
  }

  public async findByUserIdAndItemId(user_id: string, item_id: string): Promise<SavedItem | undefined> {
    return this.ormRepository.findOne({ where: { user_id, item_id } });
  }

  public async deleteByUserIdAndItemId(user_id: string, item_id: string): Promise<void> {
    await this.ormRepository.delete({ user_id, item_id });
  }
}
