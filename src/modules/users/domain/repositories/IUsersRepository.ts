import { IUser } from '../models/IUser';
import { ICreateUser } from '../models/ICreateUser';

export interface IUsersRepository {
  findByName(name: string): Promise<IUser | undefined>;
  findById(id: string): Promise<IUser | undefined>;
  findByEmail(email: string): Promise<IUser | undefined>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<IUser | void>;
  findAll(): Promise<IUser[] | undefined>;
}
