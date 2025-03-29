import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/items/domain/repositories/IItemsRepository';
import { ICreateItem } from '@modules/items/domain/models/ICreateItem';
import { IItem } from '@modules/items/domain/models/IItem';
import { IUser } from '@modules/users/domain/models/IUser';

@injectable()
class ItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  // ✅ Create Item (Tracks a Listing), Linked to the Logged-in User
  public async create(user: IUser, data: ICreateItem): Promise<IItem> {
    const item = await this.itemsRepository.create({
      ...data,
      user_id: user.id, // Ensure the item belongs to the logged-in user
    });

    return item;
  }

  // ✅ Ensure a User Can Only Access Their Own Tracked Items
  public async findById(user: IUser, id: string): Promise<IItem> {
    const item = await this.itemsRepository.findById(id);

    if (!item || item.user_id !== user.id) {
      throw new AppError('Item not found or access denied', 403);
    }

    return item;
  }

  // ✅ Fetch only the user's tracked items
  public async findAll(user: IUser): Promise<IItem[]> {
    return await this.itemsRepository.findByUserId(user.id);
  }

  // ✅ Update Item (Only if owned by the logged-in user)
  public async update(
    user: IUser,
    id: string,
    data: Partial<ICreateItem>,
  ): Promise<IItem> {
    const item = await this.findById(user, id);

    Object.assign(item, data);

    return await this.itemsRepository.save(item);
  }

  // ✅ Delete Item (Only if owned by the logged-in user)
  public async delete(user: IUser, id: string): Promise<void> {
    const item = await this.findById(user, id);

    await this.itemsRepository.remove(item);
  }
}

export default ItemService;
