import { inject, injectable } from 'tsyringe';
import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';
import UserItem from '../infra/typeorm/entities/UserItems';

@injectable()
class ListUserItemsService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(userId: string): Promise<UserItem[]> {
    return this.userItemsRepository.listByUser(userId);
  }
}

export default ListUserItemsService;
