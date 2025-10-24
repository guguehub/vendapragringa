import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import IUserQuotaRepository from '@modules/user_quota/domain/repositories/IUserQuotaRepository';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';
import { ICreateUserQuotaDTO } from '@modules/user_quota/dtos/ICreateUserQuotaDTO';

interface IRequest {
  user_id: string;
  saved_items_limit?: number;
  scrape_logs_limit?: number;
}

@injectable()
class CreateUserQuotaService {
  constructor(
    @inject('UserQuotasRepository')
    private userQuotasRepository: IUserQuotaRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    saved_items_limit = 100,
    scrape_logs_limit = 200,
  }: IRequest): Promise<UserQuota> {
    if (!user_id) {
      throw new AppError('ID do usuário é obrigatório para criar quotas.');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const existingQuota = await this.userQuotasRepository.findByUserId(user_id);

    if (existingQuota) {
      throw new AppError('O usuário já possui quotas registradas.');
    }

    const quotaData: ICreateUserQuotaDTO = {
      user_id,
      saved_items_limit,
      scrape_logs_limit,
      scrape_count: 0,
      scrape_balance: 0,
      daily_bonus_count: 0,
      item_limit: 0,
    };

    const quota = await this.userQuotasRepository.create(quotaData);

    if (!quota?.id) {
      throw new AppError('Falha ao criar quotas do usuário.');
    }

    return quota;
  }
}

export default CreateUserQuotaService;
