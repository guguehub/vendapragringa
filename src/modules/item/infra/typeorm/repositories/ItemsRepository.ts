import { Repository, DataSource } from 'typeorm';
import {
  IItemsRepository,
  ICreateItemDTO,
} from '@modules/item/domain/repositories/IItemsRepository';
import Item from '../entities/Item';

class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Item);
  }

  public async create(data: ICreateItemDTO): Promise<Item> {
    const item = this.ormRepository.create(data);
    await this.ormRepository.save(item);
    return item;
  }

  public async findByIdWithSupplier(id: string): Promise<Item | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

  public async findById(id: string): Promise<Item | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
  }

  public async findByUserId(userId: string): Promise<Item[]> {
    return this.ormRepository.find({
      where: { user: { id: userId } },
      relations: ['supplier'],
    });
  }

  public async save(item: Item): Promise<Item> {
    return this.ormRepository.save(item);
  }

  public async remove(item: Item): Promise<void> {
    await this.ormRepository.remove(item);
  }
}

export default ItemsRepository;
