import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import {
  IItemsRepository,
  ICreateItemDTO,
} from '@modules/items/domain/repositories/IItemsRepository';
import Item from '@modules/items/infra/typeorm/entities/Item';
import { IUser } from '@modules/users/domain/models/IUser';

@injectable()
class ItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async create(user: IUser, data: ICreateItemDTO): Promise<Item> {
    const item = await this.itemsRepository.create({
      ...data,
      user_id: user.id,
    });

    return item;
  }

  public async findById(user: IUser, id: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id);

    if (!item || item.user.id !== user.id) {
      throw new AppError('Item not found or access denied', 403);
    }

    return item;
  }

  public async findAll(user: IUser): Promise<Item[]> {
    return this.itemsRepository.findByUserId(user.id);
  }

  public async update(
    user: IUser,
    id: string,
    data: Partial<ICreateItemDTO>,
  ): Promise<Item> {
    const item = await this.findById(user, id);

    Object.assign(item, data);

    return this.itemsRepository.save(item);
  }

  public async delete(user: IUser, id: string): Promise<void> {
    const item = await this.findById(user, id);

    await this.itemsRepository.remove(item);
  }
}

export default ItemService;
