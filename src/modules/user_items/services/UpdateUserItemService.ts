// src/modules/user_items/services/UpdateUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

// DTO atualizado com campos editáveis + snapshots + finance
interface IUpdateUserItemDTO {
  quantity?: number;
  notes?: string | null;
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';

  // Snapshots
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string;
  snapshotMarketplace?: string;
  snapshotExternalId?: string;

  // Finance / eBay
  ebay_fee_percent?: number;
  use_custom_fee_percent?: boolean;
  custom_fee_percent?: number;
  ebay_fees_usd?: number;
  sale_value_usd?: number;
  exchange_rate?: number;
  received_brl?: number;
  item_profit_brl?: number;
}

@injectable()
class UpdateUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(
    id: string,
    user_id: string,
    data: IUpdateUserItemDTO,
  ): Promise<IUserItem> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, user_id);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    Object.assign(userItem, data);

    return this.userItemsRepository.save(userItem);
  }
}

export default UpdateUserItemService;
