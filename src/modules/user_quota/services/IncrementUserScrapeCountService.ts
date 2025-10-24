import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';

@injectable()
export class IncrementUserScrapeCountService {
  constructor(
    @inject('UserQuotaRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  async execute(user_id: string): Promise<void> {
    await this.userQuotaRepository.incrementScrapeCount(user_id);
  }
}
