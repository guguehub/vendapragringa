import { inject, injectable } from 'tsyringe';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';

@injectable()
export default class GetUserItemMetricsService {
  constructor(
    @inject('UserItemLogRepository')
    private repository: IUserItemLogRepository,
  ) {}

  public async execute(user_item_id: string) {
    const logs = await this.repository.listByUserItemId(user_item_id);
    const uniqueUsers = await this.repository.countUniqueUsers(user_item_id);
    return { total: logs.length, uniqueUsers };
  }
}