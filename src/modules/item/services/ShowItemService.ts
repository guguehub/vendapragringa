// src/modules/item/services/ShowItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import  IItemsRepository  from '@modules/item/domain/repositories/IItemsRepository';
import { IItem } from '@modules/item/domain/models/IItem';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { IMarketplaces } from '@modules/suppliers/domain/models/IMarketplaces';

@injectable()
class ShowItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(id: string): Promise<IItem> {
    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      externalId: item.externalId,
      marketplace: item.marketplace,
      condition: item.condition,
      soldCount: item.soldCount,
      shippingPrice: item.shippingPrice,
      itemStatus: item.itemStatus,
      itemLink: item.itemLink,
      lastScrapedAt: item.lastScrapedAt,
      importStage: item.importStage,
      isDraft: item.isDraft,
      isSynced: item.isSynced,
      supplier: item.supplier
        ? {
            id: item.supplier.id,
            name: item.supplier.name,
            marketplace: item.supplier.marketplace || IMarketplaces.CUSTOM,
            status: item.supplier.status,
            is_active: item.supplier.is_active,
            created_at: item.supplier.created_at,
            updated_at: item.supplier.updated_at,
          }
        : undefined,
      images: item.images || [],
      status: item.status as any, // ajustar para enum ItemStatus se necessário
      createdBy: item.createdBy,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }
}

export default ShowItemService;
