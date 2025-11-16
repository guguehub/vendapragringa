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
    if (!user) {
      throw new AppError('User not found.');
    }

    // 2️⃣ Verifica se o usuário possui subscription
    if (!user.subscription) {
      console.warn(
        `[UpgradeUserTierService] Nenhuma subscription vinculada ao usuário ${user.id}.`,
      );
      return; // evita erro mas não quebra o fluxo de build
    }

    // 3️⃣ Trabalha com a subscription garantida
    const subscription = user.subscription;
    const oldTier = subscription.tier;

    subscription.tier = newTier;
    await this.usersRepository.save(user);

    // 4️⃣ Ajusta cotas conforme o tier
    const quota = await this.userQuotaService.getUserQuota(userId);

    if (!quota) {
      await this.userQuotaService.resetQuotaForTier(userId, newTier);
    } else if (oldTier !== newTier) {
      await this.updateUserQuotaOnTierChange.execute(userId, newTier);
    }

    // 5️⃣ Limpa cache da subscription
    await RedisCache.invalidate(`user-subscription-${userId}`);
  }
}
