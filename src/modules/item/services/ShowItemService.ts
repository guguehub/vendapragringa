import { inject, injectable } from 'tsyringe';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import Item from '@modules/item/infra/typeorm/entities/Item';

@injectable()
class ShowItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(id: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }
}

export default ShowItemService;
