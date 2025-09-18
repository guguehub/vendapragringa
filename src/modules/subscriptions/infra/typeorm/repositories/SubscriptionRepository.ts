import { Repository, DeepPartial } from 'typeorm';
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
    const subscription = this.ormRepository.create(data as DeepPartial<Subscription>);
    await this.ormRepository.save(subscription);
    return subscription;
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    return await this.ormRepository.save(subscription);
  }

  public async findByUserId(userId: string): Promise<Subscription | undefined> {
    return await this.ormRepository.findOne({
      where: { userId },
      order: { created_at: 'DESC' },
    }) ?? undefined;
  }

  public async findActiveByUserId(userId: string): Promise<Subscription | undefined> {
    const now = new Date();

    // traz todas assinaturas ativas
    const subscriptions = await this.ormRepository.find({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { created_at: 'DESC' },
    });

    if (!subscriptions.length) return undefined;

    // prioridade: INFINITY → expirando no futuro → sem expires_at (FREE)
    const infinitySub = subscriptions.find(s => s.tier === SubscriptionTier.INFINITY);
    if (infinitySub) return infinitySub;

    const validSub = subscriptions.find(s => s.expires_at && s.expires_at > now);
    if (validSub) return validSub;

    const freeSub = subscriptions.find(s => !s.expires_at);
    if (freeSub) return freeSub;

    return undefined;
  }

  public async findById(id: string): Promise<Subscription | undefined> {
    return await this.ormRepository.findOne({ where: { id } }) ?? undefined;
  }

  public async findLatestByUserId(userId: string): Promise<Subscription | null> {
    return await this.ormRepository.findOne({
      where: { userId },
      order: { created_at: 'DESC' },
    });
  }
}

export default SubscriptionRepository;
