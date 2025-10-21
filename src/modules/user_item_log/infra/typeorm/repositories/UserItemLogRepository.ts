import { DeepPartial, Repository } from 'typeorm';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';
import { IUserItemLog } from '@modules/user_item_log/domain/models/IUserItemLog';
import UserItemLog from '../entities/UserItemLog';
import dataSource from '@shared/infra/typeorm/data-source';

export class UserItemLogRepository implements IUserItemLogRepository {
  private ormRepository: Repository<UserItemLog>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserItemLog);
  }

 public async create(log: IUserItemLog): Promise<IUserItemLog> {
    const userItemLog = this.ormRepository.create(log as DeepPartial<UserItemLog>);
    await this.ormRepository.save(userItemLog);
    return userItemLog;
  }

  public async listByUserItemId(user_item_id: string): Promise<IUserItemLog[]> {
    return this.ormRepository.find({ where: { user_item_id } });
  }

  public async countUniqueUsers(user_item_id: string): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder('log')
      .where('log.user_item_id = :user_item_id', { user_item_id })
      .andWhere('log.user_id IS NOT NULL')
      .select('COUNT(DISTINCT log.user_id)', 'count')
      .getRawOne();
    return Number(result.count);
  }
}
