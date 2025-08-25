// src/modules/item/services/CreateItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';

@injectable()
class CreateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string, data: ICreateItem): Promise<Item> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const item = await this.itemsRepository.create({
      ...data,
    });

    return item;
  }
}

export default CreateItemService;
