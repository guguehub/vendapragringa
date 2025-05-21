//import 'reflect-metadata';

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
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const usersRepository = await this.usersRepository.findById(id);

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('Product not found');
    }

    await this.usersRepository.remove(user);
  }
}

export default DeleteUserService;
