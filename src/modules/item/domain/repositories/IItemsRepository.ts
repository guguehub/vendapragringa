import Item from 'src/modules/item/infra/typeorm/entities/Item';

interface ICreateItemDTO {
  name: string;
  price: number;
  description?: string;
  marketplace?: string;
  external_id?: string;
  shipping_price?: number;
  status?: string;
  supplier_id?: string;
  is_listed_on_ebay?: boolean | null; // Nullable boolean field
}

interface IItemsRepository {
  create(data: ICreateItemDTO): Promise<Item>;
  findById(id: string): Promise<Item | undefined>;
  findByUserId(userId: string): Promise<Item[]>;
  save(item: Item): Promise<Item>;
  remove(item: Item): Promise<void>;
}

export { IItemsRepository, ICreateItemDTO };
