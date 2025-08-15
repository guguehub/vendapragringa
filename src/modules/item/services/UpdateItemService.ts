import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { IUpdateItem } from '@modules/item/domain/models/IUpdateItem';

@injectable()
class UpdateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(data: IUpdateItem): Promise<Item> {
    const { id } = data;

    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    Object.assign(item, data); // Atualiza as propriedades do item com os dados recebidos

    const updatedItem = await this.itemsRepository.save(item);

    return updatedItem;
  }
}

export default UpdateItemService;
