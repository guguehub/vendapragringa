import 'dotenv/config';
import { DataSource } from 'typeorm';

// Entities
import User from '../../../modules/users/infra/typeorm/entities/User';
import UserToken from '../../../modules/users/infra/typeorm/entities/UserToken';
import Product from '../../../modules/products/infra/typeorm/entities/Product';
import Supplier from '../../../modules/suppliers/infra/typeorm/entities/Supplier';
import Item from '../../../modules/item/infra/typeorm/entities/Item';
import { SavedItem } from '../../../modules/saved-items/infra/typeorm/entities/SavedItem';
import { Subscription } from '../../../modules/subscriptions/infra/typeorm/entities/Subscription';

// Shipping entities
import ShippingType from '../../../modules/shipping/infra/typeorm/entities/ShippingType';
import ShippingZone from '../../../modules/shipping/infra/typeorm/entities/ShippingZone';
import ShippingWeight from '../../../modules/shipping/infra/typeorm/entities/ShippingWeight';
import ShippingPrice from '../../../modules/shipping/infra/typeorm/entities/ShippingPrice';
import ShippingZoneCountry from '../../../modules/shipping/infra/typeorm/entities/ShippingZoneCountry';
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';

console.log('🌐 Env vars (verificação):', {
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  user: process.env.TYPEORM_USERNAME,
  pass: process.env.TYPEORM_PASSWORD,
  db: process.env.TYPEORM_DATABASE,
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT) || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [
    User,
    UserToken,
    SavedItem,
    UserItem,
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

  migrations: ['src/shared/infra/typeorm/migrations/*.ts'],

  synchronize: false,
  migrationsRun: false,
  logging: false,
});

// Se rodar diretamente: testar conexão
if (require.main === module) {
  dataSource
    .initialize()
    .then(() => {
      console.log('✅ DataSource has been initialized!');

    })
    .catch(err => {
      console.error('❌ Error during Data Source initialization:', err);
    });
}

// ⚠️ Exportação necessária para o TypeORM CLI funcionar
export default dataSource ;
