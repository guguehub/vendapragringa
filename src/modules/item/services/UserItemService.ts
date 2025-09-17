// src/modules/item/services/UserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { IUser } from '@modules/users/domain/models/IUser';
import { ICreateItem } from '../domain/models/ICreateItem';

@injectable()
class UserItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  // Busca um item global e apenas garante que ele existe
  public async findById(user: IUser, id: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id);

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    return item;
  }

  // Retorna todos os itens (global)
  public async findAll(user: IUser): Promise<Item[]> {
    return this.itemsRepository.findAll();
  }

  // Atualiza um item global
  public async update(
    user: IUser,
    id: string,
    data: Partial<ICreateItem>,
  ): Promise<Item> {
    const item = await this.findById(user, id);

    Object.assign(item, data);

    return this.itemsRepository.save(item);
  }

  // Remove um item global
  public async delete(user: IUser, id: string): Promise<void> {
    const item = await this.findById(user, id);

    await this.itemsRepository.remove(item);
  }
}

export default UserItemService;
