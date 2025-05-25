import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingZone from '../entities/ShippingZone';
import { IShippingZonesRepository } from '@modules/shipping/domain/repositories/IShippingZonesRepository';

export class ShippingZonesRepository implements IShippingZonesRepository {
  private ormRepo: Repository<ShippingZone>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingZone);
  }

  async findAll(): Promise<ShippingZone[]> {
    return this.ormRepo.find();
  }

  async findById(id: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByCountryCode(countryCode: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { countryCode } });
  }

  async findByName(name: string): Promise<ShippingZone | null> {
    return this.ormRepo.findOne({ where: { name } });
  }

  async createMany(zones: Partial<ShippingZone>[]): Promise<void> {
    const newZones = this.ormRepo.create(zones);
    await this.ormRepo.save(newZones);
  }
}
