import Customer from '@modules/customers/infra/typeorm/entities/Customer';

export interface ICreateCustomer {
  name: string;
  email: string;
}
