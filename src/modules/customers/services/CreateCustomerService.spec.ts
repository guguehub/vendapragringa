import 'reflect-metadata';
import CreateCustomerService from './CreateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });
  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'John Silva',
      email: 'teste@tester',
    });
    expect(customer).toHaveProperty('id');
  });

  it('should NOT be able to create customer if email already taken', async () => {
    await createCustomer.execute({
      name: 'John silva',
      email: 'test@tester',
    });
    expect(
      createCustomer.execute({
        name: 'John silva',
        email: 'test@tester',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
