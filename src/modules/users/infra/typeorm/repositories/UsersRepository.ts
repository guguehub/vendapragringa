import { Repository } from 'typeorm';
import User from '../entities/User';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUser } from '@modules/users/domain/models/IUser';
import dataSource from '@shared/infra/typeorm';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;
  constructor() {
    this.ormRepository = dataSource.getRepository(User);
  }
  findOne(id: IUser): Promise<IUser | null> {
    throw new Error('Method not implemented.');
  }

  public async findAllByOwner(userId: string): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);
    return user;
  }

  async save(user: User): Promise<IUser> {
    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async remove(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return user;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });

    return user;
  }

  public async findAll(): Promise<IUser[]> {
    const users = await this.ormRepository.find();

    return users;
  }
}

export default UsersRepository;
