import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import UserItem from '../infra/typeorm/entities/UserItems';
import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';
import { ICreateUserItemDTO } from '../dtos/ICreateUserItemDTO';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';

interface IRequest {
  user_id: string;
  item_id: string;
  quantity?: number;
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
}

@injectable()
export default class SaveAsUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,

    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute({ user_id, item_id, quantity = 1, import_stage = 'draft' }: IRequest): Promise<UserItem> {
    // 1. Verifica se o item existe
    const item = await this.itemsRepository.findById(item_id);

    if (!item) {
      throw new AppError('Item não encontrado', 404);
    }

    // 2. Monta DTO a partir do Item
    const data: ICreateUserItemDTO = {
      user_id,
      item_id,
      quantity,
      import_stage,

      // Snapshot
      snapshotTitle: item.title,
      snapshotPrice: item.price,
      snapshotImages: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
      snapshotMarketplace: item.marketplace,
      snapshotExternalId: item.externalId,

      // Flags iniciais (default)
      is_listed_on_ebay: false,
      is_offer_enabled: false,
      is_campaign_enabled: false,
      use_custom_fee_percent: false,
    };

    // 3. Cria o UserItem
    const userItem = await this.userItemsRepository.create(data);

    return userItem;
  }
}
