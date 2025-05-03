import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ISavedItemsRepository } from '../domain/repositories/ISavedItemsRepository';
import { ICreateSavedItem } from '../domain/models/ICreateSavedItem';
import { SavedItem } from '../infra/typeorm/entities/SavedItem';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

const tierLimits: Record<SubscriptionTier, number> = {
  free: 6,
  bronze: 25,
  silver: 50,
  gold: 150,
};

@injectable()
export class SaveItemService {
  constructor(
    @inject('SavedItemsRepository')
    private savedItemsRepository: ISavedItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    user_id: string,
    itemData: ICreateSavedItem,
  ): Promise<SavedItem> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const subscription = user.subscription;

    if (!subscription || !subscription.tier) {
      throw new AppError('Subscription information not available', 403);
    }

    const tier = subscription.tier as SubscriptionTier;
    const maxItems = tierLimits[tier] ?? 0;

    const currentCount = await this.savedItemsRepository.countByUserId(user_id);

    if (currentCount >= maxItems) {
      throw new AppError(
        `You have reached the limit of saved items for your plan (${maxItems})`,
        403,
      );
    }

    const savedItem = await this.savedItemsRepository.create({
      ...itemData,
      user_id,
    });

    return savedItem;
  }
}
