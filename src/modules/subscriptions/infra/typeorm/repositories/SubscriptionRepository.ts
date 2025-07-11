import { Repository, MoreThan, DeepPartial } from 'typeorm';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';

import { SubscriptionStatus } from '../entities/Subscription';
import { Subscription } from '../entities/Subscription';
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
      order: { createdAt: 'DESC' },
    });
    return result ?? undefined;
  }

  public async findActiveByUserId(
    userId: string,
  ): Promise<Subscription | undefined> {
    const now = new Date();

    const result = await this.ormRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: MoreThan(now), // permite planos ativos com expiração futura
      },
      order: { createdAt: 'DESC' },
    });
    return result ?? undefined;
  }
}

export default SubscriptionRepository;
