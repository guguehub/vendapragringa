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
    }));
  }
}

export default ListItemService;
