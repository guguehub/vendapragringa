// src/modules/user_items/services/ListUserItemsService.ts

import { inject, injectable } from 'tsyringe';

import { IUserItemsRepository } from '../domain/repositories/IUserItemsRepository';
import { IUserItem } from '../domain/models/IUserItem';

@injectable()
class ListUserItemsService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(user_id: string): Promise<IUserItem[]> {
    const userItems = await this.userItemsRepository.findByUserId(user_id);

    return userItems;
  }
}

export default ListUserItemsService;
