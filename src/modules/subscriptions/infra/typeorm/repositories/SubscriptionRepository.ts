import { Repository } from 'typeorm';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionRepository';
import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';

import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-tier.enum';
import { Subscription } from '../entities/Subscription';
import dataSource from '@shared/infra/typeorm';

class SubscriptionRepository implements ISubscriptionRepository {
  private ormRepository: Repository<Subscription>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Subscription);
  }

  public async create(data: ICreateSubscription): Promise<ISubscription> {
    const subscription = this.ormRepository.create(data);
    await this.ormRepository.save(subscription);
    return subscription;
  }

  public async findByUserId(
    userId: string,
  ): Promise<ISubscription | undefined> {
    return await this.ormRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findActiveByUserId(
    userId: string,
  ): Promise<ISubscription | undefined> {
    const now = new Date();

    return await this.ormRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: null, // ou: LessThanOrEqual(now), se tiver expiração definida
      },
      order: { createdAt: 'DESC' },
    });
  }
}

export default SubscriptionRepository;
