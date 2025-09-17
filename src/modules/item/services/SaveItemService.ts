import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ISavedItemsRepository } from '../../saved-items/domain/repositories/ISavedItemsRepository';
import { ICreateSavedItem } from '../../saved-items/domain/interfaces/ICreateSavedItem';
import { SavedItem } from '../../saved-items/infra/typeorm/entities/SavedItem';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionTierLimits } from '@modules/subscriptions/enums/subscription-limits.enum';

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
    const maxItems = SubscriptionTierLimits[tier] ?? 0;

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
