import { EntityRepository, getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUser } from '@modules/users/domain/models/IUser';

class FakeUsersRepository
  implements Omit<IUsersRepository, 'remove' | 'findAll'>
{
  private users: User[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = new User();
    user.id = '1234';
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<IUser> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

  //rever
  public async remove(user: User): Promise<IUser | void> {
    throw new Error('Method not implemented.');
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = this.users.find(user => user.name === name);

    return user;
  }

  public async findById(id: string): Promise<IUser | undefined> {
    const user = this.users.find(user => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    const user = this.users.find(user => user.email === email);

    return user;
  }

  public async findAll(): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }
}

export default FakeUsersRepository;
