import UserAddress from "@modules/users/infra/typeorm/entities/UserAddress";
import { ICreateUserAddress } from "../models/ICreateUserAddress";

export interface IUserAddressRepository {
  create(data: ICreateUserAddress): Promise<UserAddress>;
  save(address: UserAddress): Promise<UserAddress>;
  findById(id: string): Promise<UserAddress | undefined>;
  findByUser(user_id: string): Promise<UserAddress[]>;
  findPrimaryByUser(user_id: string): Promise<UserAddress | undefined>;
  delete(id: string): Promise<void>;
}
