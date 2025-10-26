import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUserQuotasRepository from '../domain/repositories/IUserQuotaRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UserQuota from '../infra/typeorm/entities/UserQuota';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { QuotaInitialValues } from '../enums/quota-initial-values.enum';

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
    // 🔍 Verifica se o usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    // 🚫 Evita duplicar quotas
    const existingQuota = await this.userQuotasRepository.findByUserId(user_id);
    if (existingQuota) {
      throw new AppError('O usuário já possui quotas registradas.');
    }

    // 🧩 Determina o tier do usuário
    // Caso não tenha assinatura ativa, assume "free"
    const tier = user.subscription?.tier || SubscriptionTier.FREE;

    // 📊 Obtém valores iniciais do tier (saldo inicial)
    const tierDefaults = QuotaInitialValues[tier] || QuotaInitialValues.free;

    // 🧮 Cria e salva quota inicial usando o repositório
    const quota = await this.userQuotasRepository.create({
      user_id,
      saved_items_limit,
      scrape_logs_limit,
      scrape_count: 0,
      scrape_balance: tierDefaults.scrape_balance, // saldo inicial conforme tier
      daily_bonus_count: 0, // começa zerado (cron credita depois)
      item_limit: 0,
    });

    return quota;
  }
}

export default CreateUserQuotaService;
