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
      name: item.name,
      description: item.description,
      price: item.price,
      user_id: item.user.id,
      user_name: item.user.name,
      updatedBy_id: item.updatedBy?.id,       // sugestão: campo optionall
      updatedBy_name: item.updatedBy?.name,   // acessar campo se existir
    }));
  }
}

export default ListItemService;
