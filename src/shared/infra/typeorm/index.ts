import { DataSource } from 'typeorm';

import User from '../../../modules/users/infra/typeorm/entities/User';
import Product from '../../../modules/products/infra/typeorm/entities/Product';
import Supplier from '../../../modules/suppliers/infra/typeorm/entities/Supplier';
import Item from '../../../modules/item/infra/typeorm/entities/Item';
import UserToken from '../../../modules/users/infra/typeorm/entities/UserToken';

import { CreateUser1698463000000 } from './migrations/1698463000000-CreateUser';
import { CreateUserTokens1698463024050 } from './migrations/1698463024050-CreateUserTokens';
import { Subscription } from '../../../modules/subscriptions/infra/typeorm/entities/Subscription';
import { CreateProduct1744866040113 } from './migrations/1744866040113-CreateProduct';
import { Item1744743397410 } from './migrations/1744743397410-Item';
import { Suppliers1744743397400 } from './migrations/1744743397400-Suppliers';
import { Subscriptions1744865128156 } from './migrations/1744865128156-Subscriptions';
import { SavedItem } from '../../../modules/item/infra/typeorm/entities/SavedItem';
import { CreateSavedItems1745380787016 } from './migrations/1745380787016-CreateSavedItems';
import { AddRelationSavedItemsToUser1745512345678 } from './migrations/1745512345678-AddRelationSavedItemsToUser';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'apivendas',
  entities: [User, UserToken, SavedItem, Product, Item, Supplier, Subscription],

  migrations: [
    CreateUser1698463000000,
    CreateUserTokens1698463024050,
    CreateProduct1744866040113,
    Item1744743397410,
    Suppliers1744743397400,
    Subscriptions1744865128156,
    CreateSavedItems1745380787016,

    AddRelationSavedItemsToUser1745512345678,
  ],

  synchronize: false,
  migrationsRun: false,
  logging: false,
});

//yarn typeorm migration:create migrations/

// Test the database connection when this file is executed directly
if (require.main === module) {
  dataSource
    .initialize()
    .then(() => {
      console.log('✅ DataSource has been initialized!');
      return dataSource.destroy();
    })
    .catch(err => {
      console.error('❌ Error during Data Source initialization:', err);
    });
}

export default dataSource;
