import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '../enums/subscription-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  userId: string;
  tier?: SubscriptionTier | string; // opcional, se não informado cria FREE
}

@injectable()
export default class CreateSubscriptionService {
  constructor(
    @inject('SubscriptionsRepository')
    private subscriptionsRepository: ISubscriptionRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, tier }: IRequest): Promise<Subscription> {
    console.log('[DEBUG] Criando/atualizando assinatura para usuário:', userId, 'com tier:', tier);

    // 1️⃣ Verifica se usuário existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      console.error('[DEBUG] Usuário não encontrado:', userId);
      throw new AppError('User not found', 404);
    }

    // 2️⃣ Determina o tier: se não veio, assume FREE
    const subscriptionTier = tier && Object.values(SubscriptionTier).includes(tier as SubscriptionTier)
      ? (tier as SubscriptionTier)
      : SubscriptionTier.FREE;

    // 3️⃣ Checa se já existe assinatura
    let subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (subscription) {
      console.log('[DEBUG] Usuário já possui assinatura, atualizando tier...');
      subscription.tier = subscriptionTier;
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.updated_at = new Date();

      subscription = await this.subscriptionsRepository.save(subscription);
      console.log('[DEBUG] Assinatura atualizada:', subscription.id);
    } else {
      console.log('[DEBUG] Nenhuma assinatura encontrada, criando nova...');
      subscription = await this.subscriptionsRepository.create({
        userId,
        tier: subscriptionTier,
        status: SubscriptionStatus.ACTIVE,
        start_date: new Date(),
        expires_at: subscriptionTier === SubscriptionTier.FREE ? null : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isTrial: false,
      });

      console.log('[DEBUG] Assinatura criada:', subscription.id);
    }

    // 4️⃣ Invalida cache do usuário no Redis
    const cacheKey = `user:${userId}`;
    await RedisCache.invalidate(cacheKey);
    console.log('[CACHE INVALIDATED] Chave do usuário removida:', cacheKey);

    return subscription;
  }
}
