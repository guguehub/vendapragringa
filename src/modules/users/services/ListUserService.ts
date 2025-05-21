import { IUser } from '../domain/models/IUser';
import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[] | null> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}

export default ListUserService;
