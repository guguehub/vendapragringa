import { container } from 'tsyringe';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import '@modules/users/providers';
import SubscriptionRepository from '@modules/subscriptions/infra/typeorm/repositories/SubscriptionRepository';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ICreateSubscription';

import { ISavedItemsRepository } from '@modules/item/domain/repositories/ISavedItemsRepository';
import { SavedItemsRepository } from '@modules/item/infra/typeorm/repositories/SavedItemsRepository';
import ItemsRepository from '@modules/item/infra/typeorm/repositories/ItemsRepository';

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ISubscriptionRepository>(
  'SubscriptionRepository',
  SubscriptionRepository,
);

container.registerSingleton<ItemsRepository>('ItemRepository', ItemsRepository);
