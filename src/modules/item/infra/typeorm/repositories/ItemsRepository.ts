// src/modules/item/infra/typeorm/repositories/ItemsRepository.ts
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm/data-source';
import Item from '@modules/item/infra/typeorm/entities/Item';
import IItemsRepository from '@modules/item/domain/repositories/IItemsRepository';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';

export default class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Item);
  }

  public async create(data: ICreateItem): Promise<Item> {
    const item = this.ormRepository.create(data);
    await this.ormRepository.save(item);
    return item;
  }

  public async findById(id: string): Promise<Item | null> {
    const item = await this.ormRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
    return item ?? null;
  }

  public async save(item: Item): Promise<Item> {
    return this.ormRepository.save(item);
  }

  public async remove(item: Item): Promise<void> {
    await this.ormRepository.remove(item);
  }

  public async findAll(): Promise<Item[]> {
    return this.ormRepository.find({
      relations: ['supplier'],
      order: { created_at: 'DESC' },
    });
  }

  public async findByExternalId(externalId: string, marketplace: string): Promise<Item | null> {
    const item = await this.ormRepository.findOne({
      where: { externalId, marketplace },
      relations: ['supplier'],
    });
    return item ?? null;
  }

  // ✅ Novo método: update parcial
  public async update(id: string, data: Partial<ICreateItem>): Promise<Item> {
    const item = await this.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    Object.assign(item, data);
    await this.ormRepository.save(item);

    return item;
  }
}
