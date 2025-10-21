import { inject, injectable } from 'tsyringe';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';
import { IUserItemLog } from '@modules/user_item_log/domain/models/IUserItemLog';

@injectable()
export default class ListUserItemLogsService {
  constructor(
    @inject('UserItemLogRepository')
    private repository: IUserItemLogRepository,
  ) {}

  public async execute(user_item_id: string): Promise<IUserItemLog[]> {
    return this.repository.listByUserItemId(user_item_id);
  }
}