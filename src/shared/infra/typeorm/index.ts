import { DataSource } from 'typeorm';

import User from '../../../modules/users/infra/typeorm/entities/User';
import UserToken from '../../../modules/users/infra/typeorm/entities/UserToken';
import Customer from '../../../modules/customers/infra/typeorm/entities/Customer';
import Order from '../../../modules/orders/infra/typeorm/entities/Order';
import OrdersProducts from '../../../modules/orders/infra/typeorm/entities/OrdersProducts';
import Product from '../../../modules/products/infra/typeorm/entities/Product';

import { CreateProducts1698109674954 } from './migrations/1698109674954-CreateProducts';
import { CreateUsers1698346943647 } from './migrations/1698346943647-CreateUsers';
import { CreateUserTokens1698463024050 } from './migrations/1698463024050-CreateUserTokens';
import { CreateCustomers1705979140252 } from './migrations/1705979140252-CreateCustomers';
import { CreateOrders1706756486885 } from './migrations/1706756486885-CreateOrders';
import { CreateOrdersProducts1706758221558 } from './migrations/1706758221558-CreateOrdersProducts';
import { AddOrderIdToOrdersProducts1706759321101 } from './migrations/1706759321101-AddOrderIdToOrdersProducts';
import { AddProductIdToOrdersProducts1706760048960 } from './migrations/1706760048960-AddProductIdToOrdersProducts';
import { AddCustomerIdToOrders1706757078633 } from './migrations/1706757078633-AddCustomerIdToOrders';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: Number(5432),
  username: 'postgres',
  password: 'docker',
  database: 'apivendas',
  entities: [User, UserToken, Customer, Order, OrdersProducts, Product],

  migrations: [
    CreateProducts1698109674954,
    CreateUsers1698346943647,
    CreateUserTokens1698463024050,
    CreateCustomers1705979140252,
    CreateOrders1706756486885,
    AddCustomerIdToOrders1706757078633,
    CreateOrdersProducts1706758221558,
    AddOrderIdToOrdersProducts1706759321101,
    AddProductIdToOrdersProducts1706760048960,
  ],
});
