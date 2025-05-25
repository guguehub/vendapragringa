import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingZone from '../entities/ShippingZone';
import ShippingZoneCountry from '../entities/ShippingZoneCountry';
import { IShippingZonesRepository } from '@modules/shipping/domain/repositories/IShippingZonesRepository';

export class ShippingZonesRepository implements IShippingZonesRepository {
  private ormRepo: Repository<ShippingZone>;
  private countryRepo: Repository<ShippingZoneCountry>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingZone);
    this.countryRepo = dataSource.getRepository(ShippingZoneCountry);
  }

  async findAll(): Promise<ShippingZone[]> {
    return this.ormRepo.find();
  }

  async findById(id: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { code } });
  }

  async findByName(name: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { name } });
  }

  async findByCountryCode(countryCode: string): Promise<ShippingZone | null> {
    const zoneCountry = await this.countryRepo.findOne({
      where: { countryCode },
      relations: ['zone'],
    });

    return zoneCountry?.zone || null;
  }

  async create(data: { name: string; code: string }): Promise<ShippingZone> {
    const zone = this.ormRepo.create(data);
    return await this.ormRepo.save(zone);
  }

  async createMany(zones: Partial<ShippingZone>[]): Promise<void> {
    const newZones = this.ormRepo.create(zones);
    await this.ormRepo.save(newZones);
  }
}
