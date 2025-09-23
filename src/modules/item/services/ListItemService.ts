import { inject, injectable } from 'tsyringe';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { IListItem } from '@modules/item/domain/models/IListItem';

@injectable()
class ListItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(): Promise<IListItem[]> {
    const items = await this.itemsRepository.findAll();

    return items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      shippingPrice: item.shippingPrice,
      status: item.status,              // string ou ItemStatus (depende do entity)
      itemStatus: item.itemStatus,
      soldCount: item.soldCount,
      condition: item.condition,
      externalId: item.externalId,      // ✅ camelCase
      marketplace: item.marketplace,
      itemLink: item.itemLink,
      images: item.images,
      isDraft: item.isDraft,            // ✅ camelCase
      isSynced: item.isSynced,          // ✅ camelCase
      supplier: item.supplier,          // relação completa, não supplierId
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }
}

export default ListItemService;
