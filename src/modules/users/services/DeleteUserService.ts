//import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private ProductsRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const usersRepository = await this.UsersRepository.find();

    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError('Product not found');
    }

    await usersRepository.remove(user);
  }
}

export default DeleteUserService;
