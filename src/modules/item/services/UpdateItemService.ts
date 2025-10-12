import { inject, injectable } from 'tsyringe';
import { IUpdateItem } from '../domain/models/IUpdateItems';
import  IItemsRepository  from '@modules/item/domain/repositories/IItemsRepository';
import AppError from '@shared/errors/AppError';
//import Item from '../typeorm/entities/Item';
import Item from '../infra/typeorm/entities/Item';

@injectable()
class UpdateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(data: IUpdateItem): Promise<Item> {
      console.log('[UpdateItemService] Recebido no body:', data); // <-- novo

    const item = await this.itemsRepository.findById(data.id);
    console.log('[UpdateItemService] Item encontrado:', item);


    if (!item) {
      throw new AppError('Item not found');
    }

    // Atualiza os campos que vieram no body
    if (data.title !== undefined) item.title = data.title;
    if (data.description !== undefined) item.description = data.description;
    if (data.price !== undefined) item.price = data.price;
    if (data.shippingPrice !== undefined) item.shippingPrice = data.shippingPrice;
    if (data.status !== undefined) item.status = data.status;
    if (data.itemStatus !== undefined) item.itemStatus = data.itemStatus;
    if (data.soldCount !== undefined) item.soldCount = data.soldCount;
    if (data.condition !== undefined) item.condition = data.condition;
    if (data.externalId !== undefined) item.externalId = data.externalId;
    if (data.marketplace !== undefined) item.marketplace = data.marketplace;
    if (data.itemLink !== undefined) item.itemLink = data.itemLink;
    if (data.images !== undefined) item.images = data.images;
    if (data.isDraft !== undefined) item.isDraft = data.isDraft;
    if (data.isSynced !== undefined) item.isSynced = data.isSynced;

    console.log('[UpdateItemService] Item após atualização:', item);


    // Salva no banco
    return this.itemsRepository.save(item);
  }
}

export default UpdateItemService;
