import { getCustomRepository } from 'typeorm';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import { IUser } from '../domain/models/IUser';
import User from '../infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[] | undefined> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}

export default ListUserService;
