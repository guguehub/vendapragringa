import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingType from '../entities/ShippingType';
import { IShippingTypeRepository } from '@modules/shipping/domain/repositories/IShippingTypeRepository';

export class ShippingTypesRepository implements IShippingTypeRepository {
  private ormRepo: Repository<ShippingType>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingType);
  }

  async findAll(): Promise<ShippingType[]> {
    return this.ormRepo.find();
  }

  async findByCode(code: 'document' | 'product'): Promise<ShippingType | null> {
    return this.ormRepo.findOneBy({ code });
  }
  async create(data: Partial<ShippingType>): Promise<ShippingType> {
  const newType = this.ormRepo.create(data);
  await this.ormRepo.save(newType);
  return newType;
}

  async findById(id: string): Promise<ShippingType | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async createMany(types: Partial<ShippingType>[]): Promise<void> {
    const newTypes = this.ormRepo.create(types);
    await this.ormRepo.save(newTypes);
  }

}
