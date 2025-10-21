import { Repository } from 'typeorm';
import UserAddress from '../entities/UserAddress';
import { ICreateUserAddress } from '@modules/users/domain/models/ICreateUserAddress';
import { IUserAddressRepository } from '@modules/users/domain/repositories/IUserAddressRepository';
import dataSource from '@shared/infra/typeorm/data-source';

class UserAddressRepository implements IUserAddressRepository {
  private ormRepository: Repository<UserAddress>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserAddress);
  }

  public async create(data: ICreateUserAddress): Promise<UserAddress> {
    const address = this.ormRepository.create(data);
    await this.ormRepository.save(address);
    return address;
  }

  public async save(address: UserAddress): Promise<UserAddress> {
    return await this.ormRepository.save(address);
  }

  public async findById(id: string): Promise<UserAddress | undefined> {
    return await this.ormRepository.findOne({ where: { id } }) ?? undefined;
  }

  public async findByUser(user_id: string): Promise<UserAddress[]> {
    const addresses = await this.ormRepository.find({ where: { user_id } });
    return addresses ?? []; // 👈 sempre retorna array, nunca undefined
  }

  public async findPrimaryByUser(user_id: string): Promise<UserAddress | undefined> {
    return await this.ormRepository.findOne({
      where: { user_id, is_default: true },
    }) ?? undefined;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UserAddressRepository;
