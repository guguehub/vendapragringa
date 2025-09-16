// src/modules/user_items/services/UpdateUserItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

// DTO só com campos editáveis
interface IUpdateUserItemDTO {
  quantity?: number;
  notes?: string | null;
  import_stage?: 'draft' | 'pending' | 'ready' | 'listed' | 'sold';
  sync_status?: 'active' | 'paused' | 'sold_out';
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
