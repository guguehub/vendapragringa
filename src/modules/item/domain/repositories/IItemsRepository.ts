import Item from "@modules/item/infra/typeorm/entities/Item";
import { ICreateItem } from "../models/ICreateItem";

export interface IItemsRepository {
  create(data: ICreateItem): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
  findAll(): Promise<Item[]>;

  // Novo método
  findByExternalId(externalId: string, marketplace: string): Promise<Item | null>;
}
