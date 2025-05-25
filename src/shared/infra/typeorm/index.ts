import { DataSource } from 'typeorm';

// Entities
import User from '../../../modules/users/infra/typeorm/entities/User';
import Product from '../../../modules/products/infra/typeorm/entities/Product';
import Supplier from '../../../modules/suppliers/infra/typeorm/entities/Supplier';
import Item from '../../../modules/item/infra/typeorm/entities/Item';
import UserToken from '../../../modules/users/infra/typeorm/entities/UserToken';
import {Subscription } from '../../../modules/subscriptions/infra/typeorm/entities/Subscription';
import {SavedItem} from '../../../modules/item/infra/typeorm/entities/SavedItem';

// Shipping entities
import ShippingType from '../../../modules/shipping/infra/typeorm/entities/ShippingType';
import ShippingZone from '../../../modules/shipping/infra/typeorm/entities/ShippingZone';
import ShippingWeight from '../../../modules/shipping/infra/typeorm/entities/ShippingWeight';
import ShippingPrice from '../../../modules/shipping/infra/typeorm/entities/ShippingPrice';
import ShippingZoneCountry from '../../../modules/shipping/infra/typeorm/entities/ShippingZoneCountry';

// Migrations
import { CreateUser1698463000000 } from './migrations/1698463000000-CreateUser';
import { CreateUserTokens1698463024050 } from './migrations/1698463024050-CreateUserTokens';
import { CreateProduct1744866040113 } from './migrations/1744866040113-CreateProduct';
import { Suppliers1744743397400 } from './migrations/1744743397400-Suppliers';
import { Subscriptions1744865128156 } from './migrations/1744865128156-Subscriptions';
import { CreateItems1745380787016 } from './migrations/1745380787016-CreateItems';
import { AddRelationSavedItemsToUser1745512345678 } from './migrations/1745512345678-AddRelationSavedItemsToUser';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [
    User,
    UserToken,
    SavedItem,
    Product,
    Item,
    Supplier,
    Subscription,

    // Shipping
    ShippingType,
    ShippingZone,
    ShippingWeight,
    ShippingPrice,
    ShippingZoneCountry,
  ],

  migrations: [
    CreateUser1698463000000,
    CreateUserTokens1698463024050,
    CreateProduct1744866040113,
    Suppliers1744743397400,
    Subscriptions1744865128156,
    CreateItems1745380787016,
    AddRelationSavedItemsToUser1745512345678,
  ],

  synchronize: false,
  migrationsRun: false,
  logging: false,
});

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
