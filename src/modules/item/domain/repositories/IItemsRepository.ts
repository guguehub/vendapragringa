import Item from 'src/modules/item/infra/typeorm/entities/Item';
import ICreateItemDTO from '../dtos/ICreateItemDTO';

interface IItemsRepository {
  create(data: ICreateItemDTO): Promise<Item>;
  findById(id: string): Promise<Item | undefined>;
  findByUserId(userId: string): Promise<Item[]>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
}

export { IItemsRepository };
