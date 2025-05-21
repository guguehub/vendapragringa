import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUser';

export interface IUsersRepository {
  findOne(id: IUser): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByName(name: string): Promise<IUser | null>;
  findAllByOwner(userId: string): Promise<IUser[]>; // Fetch only the logged-in user's data
}
