// src/modules/subscriptions/services/CreateSubscriptionService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository'
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

@injectable()
class CreateSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionRepository: ISubscriptionRepository,

    @inject('UserRepository')
    private userRepository: IUsersRepository, // verificar se usuário existe
  ) {}

  public async execute({
    userId,
    tier,
    status,
  }: ICreateSubscription): Promise<ISubscription> {
    // 1️⃣ verifica se o usuário existe
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new AppError(
        `User not found. Verify the userId: ${userId}`,
        404,
      );
    }

    // 2️⃣ verifica se o usuário já possui assinatura
    const existingSubscription =
      await this.subscriptionRepository.findByUserId(userId);

    if (existingSubscription) {
      throw new AppError('This user already has a subscription', 400);
    }

    // 3️⃣ define expires_at conforme plano
    const subscriptionData: ICreateSubscription = {
      userId,
      tier,
      status,
      start_date: new Date(),
      expires_at:
        tier === SubscriptionTier.INFINITY
          ? null
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };

    // 4️⃣ cria assinatura
    const subscription = await this.subscriptionRepository.create(subscriptionData);

    // 5️⃣ invalida cache se existir
    await RedisCache.invalidate(`user-subscription-${userId}`);

    return subscription;
  }
}

export default CreateSubscriptionService;
