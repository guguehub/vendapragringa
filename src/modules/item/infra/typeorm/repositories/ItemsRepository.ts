import { Repository, DataSource } from 'typeorm';
import { IItemsRepository } from 'src/modules/item/domain/repositories/IItemsRepository';
import Item from '../entities/Item';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';

class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Item);
  }

  public async create(data: ICreateItem): Promise<Item> {
    const item = this.ormRepository.create(data);
    await this.ormRepository.save(item);
    return item;
  }


  public async findById(id: string): Promise<Item | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
  }

  public async findByUserId(userId: string): Promise<Item[]> {
    return this.ormRepository.find({
      where: { user_id: userId },
      relations: ['supplier'],
    });
  }
// --- testar--
  public async findByStatus(status?: string): Promise<Item[]> {
  if (status) {
    return this.ormRepository.find({
      where: { status },
      relations: ['supplier'],
    });
  }

  // Se status não for informado, retorna todos
  return this.ormRepository.find({
    relations: ['supplier'],
  });
}
//-- testar se melhor implementar errors
  public async save(item: Item): Promise<Item> {
    return this.ormRepository.save(item);
  }

  public async remove(item: Item): Promise<void> {
    await this.ormRepository.remove(item);
  }
}

export default ItemsRepository;
