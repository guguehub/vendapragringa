import { Repository } from 'typeorm';
import { IUserQuota } from '@modules/user_quota/domain/models/IUserQuota';
import dataSource from '@shared/infra/typeorm/data-source';
import IUserQuotaRepository from '@modules/user_quota/domain/repositories/IUserQuotaRepository';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';

export default class UserQuotasRepository implements IUserQuotaRepository {
  private ormRepository: Repository<UserQuota>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserQuota);
  }

  public async findByUserId(user_id: string): Promise<IUserQuota | null> {
    const quota = await this.ormRepository.findOne({ where: { user_id } });
    return quota || null;
  }

  public async create(data: IUserQuota): Promise<IUserQuota> {
    const quota = this.ormRepository.create(data);
    await this.ormRepository.save(quota);
    return quota;
  }

  public async update(userQuota: IUserQuota): Promise<IUserQuota> {
    return this.ormRepository.save(userQuota);
  }

  public async save(userQuota: IUserQuota): Promise<IUserQuota> {
    return await this.ormRepository.save(userQuota);
  }

  public async incrementScrapeCount(user_id: string, amount = 1): Promise<void> {
    await this.ormRepository.increment({ user_id }, 'scrape_count', amount);
    await this.ormRepository.increment({ user_id }, 'scrape_balance', amount);
  }

  public async resetDailyBonus(user_id: string): Promise<void> {
    await this.ormRepository.update({ user_id }, { daily_bonus_count: 0 });
  }
}
