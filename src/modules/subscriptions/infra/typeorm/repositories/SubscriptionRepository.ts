import { Repository, MoreThan, DeepPartial } from 'typeorm';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';

import { Subscription } from '../entities/Subscription';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

import dataSource from '@shared/infra/typeorm/data-source';

class SubscriptionRepository implements ISubscriptionRepository {
  private ormRepository: Repository<Subscription>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Subscription);
  }

  public async create(data: ICreateSubscription): Promise<Subscription> {
    const subscription = this.ormRepository.create(
      data as DeepPartial<Subscription>,
    );
    await this.ormRepository.save(subscription);
    return subscription;
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    return await this.ormRepository.save(subscription);
  }

  public async findByUserId(userId: string): Promise<Subscription | undefined> {
    const result = await this.ormRepository.findOne({
      where: { userId },
      order: { created_at: 'DESC' },
    });
    return result ?? undefined;
  }

  public async findActiveByUserId(
    userId: string,
  ): Promise<Subscription | undefined> {
    const now = new Date();

    const result = await this.ormRepository.findOne({
      where: [
        {
          userId,
          status: SubscriptionStatus.ACTIVE,
          expires_at: MoreThan(now), // planos normais ativos com expiração futura
        },
        {
          userId,
          status: SubscriptionStatus.ACTIVE,
          tier: SubscriptionTier.INFINITY, // plano vitalício sempre ativo
        },
      ],
      order: { created_at: 'DESC' },
    });

    return result ?? undefined;
  }

  public async findById(id: string): Promise<Subscription | undefined> {
    const subscription = await this.ormRepository.findOne({
      where: { id },
    });
    return subscription ?? undefined;
  }

  // opcional, não faz parte da interface mas pode ser útil
  public async findLatestByUserId(
    userId: string,
  ): Promise<Subscription | null> {
    return this.ormRepository.findOne({
      where: { userId },
      order: { created_at: 'DESC' },
    });
  }
}

export default SubscriptionRepository;
