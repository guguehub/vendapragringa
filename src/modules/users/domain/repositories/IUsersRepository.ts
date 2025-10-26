import { IUser } from '../models/IUser';
import { ICreateUser } from '../models/ICreateUser';

export interface IUsersRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByName(name: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findAllByOwner(userId: string): Promise<IUser[]>;

  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
}
