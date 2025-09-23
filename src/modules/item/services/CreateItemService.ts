// src/modules/item/services/CreateItemService.ts
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
    const { external_id, marketplace } = data;

    // Evitar duplicata
    if (external_id && marketplace) {
      const existing = await this.itemsRepository.findByExternalId(
        external_id,
        marketplace,
      );

      if (existing) {
        throw new AppError('Item already exists for this marketplace', 409);
      }
    }

    const item = await this.itemsRepository.create({
      ...data,
      created_by: userId,
    });

    return item;
  }
}

export default CreateItemService;
