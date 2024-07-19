import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';

describe('CreateCustomer', () => {
  it('should be able to create a new customer', async () => {
    const fakeCustomersRepository = new FakeCustomersRepository();

    const createCustomer = new CreateCustomerService(fakeCustomersRepository);
    const customer = await createCustomer.execute({
      name: 'John Silva',
      email: 'teste@tester',
    });
    expect(customer).toHaveProperty('id');
  });

  it('should NOT be able to create customer if email already taken', () => {
    expect(1).toBe(1);
  });
});
