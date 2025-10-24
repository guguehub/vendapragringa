import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';
import IUserQuotasRepository from '../domain/repositories/IUserQuotaRepository';

interface IRequest {
  user_id: string;
  saved_items_limit?: number;
  scrape_logs_limit?: number;
}

@injectable()
class CreateUserQuotaService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotasRepository: IUserQuotasRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    saved_items_limit = 100,
    scrape_logs_limit = 200,
  }: IRequest): Promise<UserQuota> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const existingQuota = await this.userQuotasRepository.findByUserId(user_id);

    if (existingQuota) {
      throw new AppError('O usuário já possui quotas registradas.');
    }

    const quota = this.userQuotasRepository.create({
      user_id,
      saved_items_limit,
      scrape_logs_limit,
      scrape_count: 0,
      scrape_balance: 0,
      item_limit: 0,
      daily_bonus_count: 0,
    }) as unknown as UserQuota;

    await this.userQuotasRepository.save(quota);

    return quota;
  }
}

export default CreateUserQuotaService;
