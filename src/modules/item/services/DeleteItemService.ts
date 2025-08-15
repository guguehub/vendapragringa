import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';

@injectable()
class DeleteItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute({ id }: { id: string }): Promise<void> {
    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    await this.itemsRepository.remove(item);

    console.log(`Item with id ${id} deleted successfully.`);
  }
}

export default DeleteItemService;
