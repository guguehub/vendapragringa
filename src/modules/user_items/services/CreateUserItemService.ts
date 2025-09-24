// src/modules/user_items/services/CreateUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

interface ICreateUserItemDTO {
  user_id: string;          // usuário dono do item
  item_id: string;          // referência ao item (pode vir de itens já cadastrados)
  quantity?: number;        // quantidade do item
  notes?: string;           // observações opcionais

  // snapshot do item no momento da criação
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string; // JSON.stringify(item.images)
  snapshotMarketplace?: string;
  snapshotExternalId?: string;
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
    notes,
  }: ICreateUserItemDTO): Promise<IUserItem> {
    if (quantity < 1) {
      throw new AppError('A quantidade deve ser pelo menos 1.');
    }

    // Verifica se usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('Usuário não encontrado.', 404);

    // Verifica se item existe
    const item = await this.itemsRepository.findById(item_id);
    if (!item) throw new AppError('Item não encontrado.', 404);

    // Verifica se usuário já possui esse item
    const existingUserItem = await this.userItemsRepository.findByUserAndItem(
      user_id,
      item_id,
    );

    if (existingUserItem) {
      existingUserItem.quantity += quantity;
      return this.userItemsRepository.save(existingUserItem);
    }

    // Cria snapshot do item
    const userItem = await this.userItemsRepository.create({
      user_id,
      item_id,
      quantity,
      notes,
      snapshotTitle: item.title,
      snapshotPrice: item.price,
      snapshotImages: item.images ? JSON.stringify(item.images) : undefined,
      snapshotMarketplace: item.marketplace,
      snapshotExternalId: item.externalId,
    });

    return this.userItemsRepository.save(userItem);
  }
}

export default CreateUserItemService;
