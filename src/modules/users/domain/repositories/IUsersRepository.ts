import { IUser } from '../models/IUser';
import { ICreateUser } from '../models/ICreateUser';

export interface IUsersRepository {
  findByName(name: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<IUser | void>;
  findAll(): Promise<IUser[] | null>;
  //find(): Promise<IUser | void>;
}
