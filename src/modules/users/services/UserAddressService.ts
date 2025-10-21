import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { ICreateUserAddress } from '../domain/models/ICreateUserAddress';
import { IUpdateUserAddress } from '../domain/models/IUpdateUserAddress';
import UserAddress from '../infra/typeorm/entities/UserAddress';
import { IUserAddressRepository } from '../domain/repositories/IUserAddressRepository';

@injectable()
class UserAddressService {
  constructor(
    @inject('UserAddressRepository')
    private userAddressRepository: IUserAddressRepository,
  ) {}

  // Criar novo endereço
  public async create(data: ICreateUserAddress): Promise<UserAddress> {
    const { user_id, is_default } = data;

    // Se for o primeiro endereço, torna-o padrão automaticamente
    const existingAddresses = await this.userAddressRepository.findByUser(user_id);
    const shouldBeDefault = existingAddresses.length === 0 ? true : is_default || false;

    // Se o novo for marcado como padrão, remove o status dos outros
    if (shouldBeDefault) {
      for (const addr of existingAddresses) {
        if (addr.is_default) {
          addr.is_default = false;
          await this.userAddressRepository.save(addr);
        }
      }
    }

    const address = await this.userAddressRepository.create({
      ...data,
      is_default: shouldBeDefault,
    });

    return address;
  }

  // Atualizar endereço
  public async update(id: string, data: IUpdateUserAddress): Promise<UserAddress> {
    const address = await this.userAddressRepository.findById(id);

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    // Se estiver definindo este como padrão, desmarca os outros
    if (data.is_default && address.user_id) {
      const allAddresses = await this.userAddressRepository.findByUser(address.user_id);

      for (const addr of allAddresses) {
        if (addr.id !== address.id && addr.is_default) {
          addr.is_default = false;
          await this.userAddressRepository.save(addr);
        }
      }
    }

    Object.assign(address, data);

    const updated = await this.userAddressRepository.save(address);
    return updated;
  }

  // Listar endereços do usuário
  public async listByUser(user_id: string): Promise<UserAddress[]> {
    const addresses = await this.userAddressRepository.findByUser(user_id);
    return addresses;
  }

  // Buscar endereço principal
  public async getPrimary(user_id: string): Promise<UserAddress | undefined> {
    const address = await this.userAddressRepository.findPrimaryByUser(user_id);
    return address;
  }

  // Deletar endereço
  public async delete(id: string): Promise<void> {
    const address = await this.userAddressRepository.findById(id);

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    await this.userAddressRepository.delete(id);
  }
}

export default UserAddressService;
