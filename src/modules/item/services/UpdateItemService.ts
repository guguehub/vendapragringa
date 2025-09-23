// src/modules/item/services/UpdateItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { IUpdateItem } from '../domain/models/IUpdateItems';
import Item from '@modules/item/infra/typeorm/entities/Item';

@injectable()
class UpdateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(data: IUpdateItem): Promise<Item> {
    const item = await this.itemsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    Object.assign(item, data);

    await this.itemsRepository.save(item);

    return item;
  }
}

export default UpdateItemService;
