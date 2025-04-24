import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-tier.enum';

import ISubscriptionsRepository from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { Subscription } from '../entities/Subscription';

class SubscriptionRepository implements ISubscriptionsRepository {
  private ormRepository: Repository<Subscription>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Subscription);
  }

  public async findByUserId(userId: string): Promise<Subscription | undefined> {
    return await this.ormRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findActiveByUserId(
    userId: string,
  ): Promise<Subscription | undefined> {
    const now = new Date();

    return await this.ormRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: null, // ou use LessThan(now) se quiser considerar expiração
      },
      order: { createdAt: 'DESC' },
    });
  }

  public async create(data: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.ormRepository.create(data);
    return this.ormRepository.save(subscription);
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    return this.ormRepository.save(subscription);
  }

  public async cancel(userId: string): Promise<void> {
    const subscription = await this.findActiveByUserId(userId);
    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.expiresAt = new Date(); // Opcional, se quiser marcar expiração no cancelamento
      await this.ormRepository.save(subscription);
    }
  }
}

export default SubscriptionRepository;
