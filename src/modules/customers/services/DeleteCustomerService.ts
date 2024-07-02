import AppError from '@shared/errors/AppError';

import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private CustomersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.CustomersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    await this.CustomersRepository.remove(customer);
  }
}

export default DeleteCustomerService;
