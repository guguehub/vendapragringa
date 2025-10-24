// src/modules/user_quota/domain/repositories/IUserQuotaRepository.ts
import UserQuota from '../../infra/typeorm/entities/UserQuota';
import { ICreateUserQuotaDTO } from '../../dtos/ICreateUserQuotaDTO';

export default interface IUserQuotaRepository {
  create(data: ICreateUserQuotaDTO): Promise<UserQuota>;
  findByUserId(user_id: string): Promise<UserQuota | null>;
  save(quota: UserQuota): Promise<UserQuota>;
  update(quota: UserQuota): Promise<UserQuota>;
  incrementScrapeCount(user_id: string): Promise<void>;
  resetDailyBonus(user_id: string, amount: number): Promise<void>; // ✅ ajustado
}
