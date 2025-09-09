import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

interface IRequest {
  userId: string;
  newTier: SubscriptionTier;
}

@injectable()
class UpgradeSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, newTier }: IRequest): Promise<void> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for this user');
    }

    // Atualiza tier
    subscription.tier = newTier;
    subscription.updatedAt = new Date();

    // Ajusta expiresAt: INFINITY não expira, outros planos expiram em 1 ano (exemplo)
    if (newTier === SubscriptionTier.INFINITY) {
      subscription.expiresAt = null;
    } else {
      subscription.expiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }

    // Caso queira, podemos manter o status ACTIVE automaticamente
    subscription.status = SubscriptionStatus.ACTIVE;

    await this.subscriptionsRepository.save(subscription);
  }
}

export default UpgradeSubscriptionService;
