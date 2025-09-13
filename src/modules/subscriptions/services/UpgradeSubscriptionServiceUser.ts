// src/modules/subscriptions/services/UpgradeSubscriptionServiceUser.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
//import Subscription from '../infra/typeorm/entities/Subscription';
import { Subscription } from '../infra/typeorm/entities/Subscription';

interface IRequest {
  userId: string;
  tier: SubscriptionTier;
}

@injectable()
export default class UpgradeSubscriptionServiceUser {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for this user');
    }

    // Atualiza tier
    subscription.tier = tier;
    subscription.updated_at = new Date();

    // Ajusta expires_at: INFINITY não expira, outros planos expiram em 1 ano
    if (tier === SubscriptionTier.INFINITY) {
      subscription.expires_at = null;
    } else {
      subscription.expires_at = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      );
    }

    // Mantém status ativo
    subscription.status = SubscriptionStatus.ACTIVE;

    // Salva e retorna
    return this.subscriptionsRepository.save(subscription);
  }
}
