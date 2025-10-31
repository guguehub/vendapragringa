import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import UpdateUserQuotaOnTierChangeService from '@modules/user_quota/services/UpdateUserQuotaOnTierChangeService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
export default class UpgradeUserTierService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject(UserQuotaService)
    private userQuotaService: UserQuotaService,

    @inject(UpdateUserQuotaOnTierChangeService)
    private updateUserQuotaOnTierChange: UpdateUserQuotaOnTierChangeService,
  ) {}

  public async execute(userId: string, newTier: SubscriptionTier): Promise<void> {
    // 1️⃣ Busca o usuário
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new AppError('User not found.');

    // 2️⃣ Atualiza o tier no usuário
    if (!user.subscription) {
      throw new AppError('User has no subscription record.');
    }

    const oldTier = user.subscription.tier;
    user.subscription.tier = newTier;
    await this.usersRepository.save(user);

    // 3️⃣ Ajusta cotas conforme o tier
    const quota = await this.userQuotaService.getUserQuota(userId);

    if (!quota) {
      // Novo usuário sem quota registrada → cria do zero
      await this.userQuotaService.resetQuotaForTier(userId, newTier);
    } else if (oldTier !== newTier) {
      // Usuário existente com tier diferente → atualiza cotas
      await this.updateUserQuotaOnTierChange.execute(userId, newTier);
    }

    // 4️⃣ Limpa cache de subscription
    await RedisCache.invalidate(`user-subscription-${userId}`);
  }
}
