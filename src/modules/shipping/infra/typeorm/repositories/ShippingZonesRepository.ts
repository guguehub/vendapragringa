import { DataSource, Repository } from 'typeorm';
import ShippingZone from '../entities/ShippingZone';

import { IShippingZonesRepository } from '@modules/shipping/domain/repositories/IShippingZonesRepository';

export class ShippingZonesRepository implements IShippingZonesRepository {
  private ormRepository: Repository<ShippingZone>;

  constructor(private dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(ShippingZone);
  }

  async findAll(): Promise<ShippingZone[]> {
    return this.ormRepository.find({
      order: { name: 'ASC' }, // ordena para dropdowns
    });
  }

  async findById(id: string): Promise<ShippingZone | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<ShippingZone | null> {
    return this.ormRepository.findOne({ where: { code } });
  }

  async findByName(name: string): Promise<ShippingZone | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

 async findByCountryCode(countryCode: string): Promise<ShippingZone | null> {
  return this.ormRepository
    .createQueryBuilder('zone')
    .leftJoinAndSelect('zone.countries', 'country')
    .where('country.countryCode = :countryCode', { countryCode })
    .getOne();
}

  async create(data: { name: string; code: string }): Promise<ShippingZone> {
    const zone = this.ormRepository.create(data);
    return await this.ormRepository.save(zone);
  }

  async createMany(zones: Array<Partial<ShippingZone>>): Promise<void> {
    const entities = this.ormRepository.create(zones);
    await this.ormRepository.save(entities);
  }
}
