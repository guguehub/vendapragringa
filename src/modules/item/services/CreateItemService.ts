import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';
import Item from '@modules/item/infra/typeorm/entities/Item';

@injectable()
class CreateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(userId: string, data: ICreateItem): Promise<Item> {
    const { externalId, marketplace } = data;

    // Evitar duplicata
    if (externalId && marketplace) {
      const existing = await this.itemsRepository.findByExternalId(
        externalId,
        marketplace,
      );
      if (existing) {
        throw new AppError('Item already exists for this marketplace', 409);
      }
    }

    // Criação do item
    const item = await this.itemsRepository.create({
  title: data.title,
  description: data.description,
  price: data.price,
  shippingPrice: data.shippingPrice,
  status: data.status ?? 'ready',
  itemStatus: data.itemStatus,
  soldCount: data.soldCount,
  condition: data.condition,
  externalId: data.externalId,
  marketplace: data.marketplace,
  itemLink: data.itemLink,
  images: data.images,
  isDraft: data.isDraft ?? false,
  isSynced: data.isSynced ?? false,
  importStage: data.importStage ?? 'draft',
  createdBy: userId,
  supplierId: data.supplierId, // ✅ apenas supplierId
});


    return item;
  }
}

export default CreateItemService;
