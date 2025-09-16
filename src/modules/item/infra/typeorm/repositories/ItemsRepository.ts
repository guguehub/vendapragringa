// src/modules/item/infra/typeorm/repositories/ItemsRepository.ts
import { Repository } from 'typeorm';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import Item from '../entities/Item';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';
import { injectable } from 'tsyringe';
import AppDataSource from '@shared/infra/typeorm/data-source';

@injectable()
class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Item);
  }

  public async create(data: ICreateItem): Promise<Item> {
    const item = this.ormRepository.create(data);
    await this.ormRepository.save(item);
    return item;
  }

  public async findById(id: string): Promise<Item | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'], // manter apenas supplier
    });
  }

  public async save(item: Item): Promise<Item> {
    return this.ormRepository.save(item);
  }

  public async remove(item: Item): Promise<void> {
    await this.ormRepository.remove(item);
  }

  public async findAll(): Promise<Item[]> {
    return this.ormRepository.find({
      relations: ['supplier'], // manter apenas supplier
    });
  }
}

export default ItemsRepository;
