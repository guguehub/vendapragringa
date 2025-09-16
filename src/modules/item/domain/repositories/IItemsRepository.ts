// src/modules/item/domain/repositories/IItemsRepository.ts
import { ICreateItem } from '../models/ICreateItem';
import Item from '@modules/item/infra/typeorm/entities/Item';

export interface IItemsRepository {
  create(data: ICreateItem): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
  findAll(): Promise<Item[]>;

  // ❌ Removido findByUserId, pois Item é agora agnóstico/global
  // findByUserId(userId: string): Promise<Item[]>;
}
