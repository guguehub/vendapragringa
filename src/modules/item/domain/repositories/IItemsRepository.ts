import Item from "@modules/item/infra/typeorm/entities/Item";
import { ICreateItem } from "../models/ICreateItem";

export default interface IItemsRepository {
  create(data: ICreateItem): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
  findAll(): Promise<Item[]>;
  findByExternalId(externalId: string, marketplace: string): Promise<Item | null>;

  // 🔹 Novo método: atualiza parcialmente um item existente
  update(id: string, data: Partial<ICreateItem>): Promise<Item>;
}
