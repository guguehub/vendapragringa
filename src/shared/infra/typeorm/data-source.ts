import 'dotenv/config';
import { DataSource } from 'typeorm';

// Entities
import User from '@modules/users/infra/typeorm/entities/User';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import UserAddress from '@modules/users/infra/typeorm/entities/UserAddress';

import Product from '@modules/products/infra/typeorm/entities/Product';
import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { SavedItem } from '@modules/saved-items/infra/typeorm/entities/SavedItem';
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';

import { Subscription } from '@modules/subscriptions/infra/typeorm/entities/Subscription';

import ItemScrapeLog from '@modules/item_scrape_log/infra/typeorm/entities/ItemScrapeLog';

// Shipping
import ShippingType from '@modules/shipping/infra/typeorm/entities/ShippingType';
import ShippingZone from '@modules/shipping/infra/typeorm/entities/ShippingZone';
import ShippingWeight from '@modules/shipping/infra/typeorm/entities/ShippingWeight';
import ShippingPrice from '@modules/shipping/infra/typeorm/entities/ShippingPrice';
import ShippingZoneCountry from '@modules/shipping/infra/typeorm/entities/ShippingZoneCountries';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';

// 🧩 Debug
console.log('🧩 Environment loaded:', {
  host: process.env.TYPEORM_HOST,
  db: process.env.TYPEORM_DATABASE,
  user: process.env.TYPEORM_USERNAME,
  port: process.env.TYPEORM_PORT,
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: Number(process.env.TYPEORM_PORT) || 5432,
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'docker',
  database: process.env.TYPEORM_DATABASE || 'apivendas',

  entities: [
    User,
    UserQuota,
    UserToken,
    UserAddress,
    Product,
    Supplier,
    Item,
    SavedItem,
    UserItem,
    Subscription,
    ItemScrapeLog,
    ShippingType,
    ShippingZone,
    ShippingWeight,
    ShippingPrice,
    ShippingZoneCountry,
  ],

  migrations: ['src/shared/infra/typeorm/migrations/*.ts'],

  synchronize: false, // nunca em prod
  migrationsRun: false,
  logging: ['error', 'warn'], // ou false para suprimir tudo,
});

// Executa conexão se rodado diretamente
if (require.main === module) {
  dataSource
    .initialize()
    .then(() => {
      console.log('✅ TypeORM DataSource conectado com sucesso!');
    })
    .catch(err => {
      console.error('❌ Erro ao inicializar DataSource:', err);
    });
}

export default dataSource;
