import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';

@injectable()
export class ResetDailyBonusService {
  constructor(
    @inject('UserQuotaRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  async execute(user_id: string, bonusAmount: number): Promise<void> {
    await this.userQuotaRepository.resetDailyBonus(user_id, bonusAmount);
  }
}
