// src/modules/user_items/services/CreateUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

interface ICreateUserItemDTO {
  user_id: string;
  item_id: string;
  quantity?: number;
}

@injectable()
class CreateUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute({
    user_id,
    item_id,
    quantity = 1,
  }: ICreateUserItemDTO): Promise<IUserItem> {
    if (quantity < 1) {
      throw new AppError('A quantidade deve ser pelo menos 1.');
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const item = await this.itemsRepository.findById(item_id);
    if (!item) {
      throw new AppError('Item não encontrado.', 404);
    }

    const existingUserItem = await this.userItemsRepository.findByUserAndItem(
      user_id,
      item_id,
    );

    if (existingUserItem) {
      existingUserItem.quantity += quantity;
      return this.userItemsRepository.save(existingUserItem);
    }

    // ✅ faltava o await aqui
    const userItem = await this.userItemsRepository.create({
      user_id,
      item_id,
      quantity,
    });

    return this.userItemsRepository.save(userItem);
  }
}

export default CreateUserItemService;
