import { ICreateItem } from '../models/ICreateItem';
import Item from '@modules/item/infra/typeorm/entities/Item';

interface IItemsRepository {
  create(data: ICreateItem): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findByUserId(userId: string): Promise<Item[]>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
    findAll(): Promise<Item[]>;

}

export { IItemsRepository };
