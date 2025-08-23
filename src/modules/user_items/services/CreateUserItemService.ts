// src/modules/user_items/services/CreateUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';
import { ICreateUserItemDTO } from '../dtos/ICreateUserItemDTO';

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
    quantity = 1, // default caso não seja informado
  }: ICreateUserItemDTO): Promise<IUserItem> {
    // 1. Validar se o usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    // 2. Validar se o item existe
    const item = await this.itemsRepository.findById(item_id);
    if (!item) {
      throw new AppError('Item não encontrado.');
    }

    // 3. Verificar se esse item já está vinculado ao usuário
    const existingUserItem = await this.userItemsRepository.findByUserAndItem(
      user_id,
      item_id,
    );

    if (existingUserItem) {
      // já existe → apenas atualizar a quantidade
      existingUserItem.quantity += quantity;
      return this.userItemsRepository.save(existingUserItem);
    }

    // 4. Criar novo registro
    const userItem = await this.userItemsRepository.create({
      user_id,
      item_id,
      quantity,
    });

    // Salva o novo registro
    return this.userItemsRepository.save(userItem);
  }
}

export default CreateUserItemService;
