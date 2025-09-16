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
    return this.userItemsRepository.listByUser(user_id);
  }
}

export default ListUserItemsService;
