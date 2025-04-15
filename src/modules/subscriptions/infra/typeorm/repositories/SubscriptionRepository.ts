import { Repository } from 'typeorm';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionRepository';
import { ICreateSubscription } from '@modules/subscriptions/domain/models/ICreateSubscription';
import { ISubscription } from '@modules/subscriptions/domain/models/ISubscription';

import Subscription from '../entities/Subscription';
import { dataSource } from '@shared/infra/typeorm';

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
    user_id: string,
  ): Promise<ISubscription | undefined> {
    return await this.ormRepository.findOne({ where: { user_id } });
  }
}

export default SubscriptionRepository;
