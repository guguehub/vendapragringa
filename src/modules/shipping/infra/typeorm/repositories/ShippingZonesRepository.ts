import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingZone from '../entities/ShippingZone';
import { IShippingZonesRepository } from '@modules/shipping/domain/repositories/IShippingZonesRepository';

export class ShippingZonesRepository implements IShippingZonesRepository {
  private ormRepo: Repository<ShippingZone>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingZone);
  }

  async findAll() {
    return this.ormRepo.find();
  }

  async findById(id: string) {
    return this.ormRepo.findOneBy({ id });
  }

  async findByCountryCode(countryCode: string) {
    return this.ormRepo.findOneBy({ country_code: countryCode });
  }
}
