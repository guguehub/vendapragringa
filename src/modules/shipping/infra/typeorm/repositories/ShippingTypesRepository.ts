import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingType from '../entities/ShippingType';
import { IShippingTypeRepository } from '@modules/shipping/domain/repositories/IShippingTypeRepository';

export class ShippingTypesRepository implements IShippingTypeRepository {
  private ormRepo: Repository<ShippingType>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingType);
  }

  async findByCode(code: 'document' | 'product') {
    return this.ormRepo.findOneBy({ code });
  }
  async findAll() {
    return this.ormRepo.find();
  }
}
