import { DataSource, Repository } from 'typeorm';
import ShippingZoneCountries from '../entities/ShippingZoneCountries';
import ShippingZone from '../entities/ShippingZone';

export class ShippingZoneCountriesRepository {
  private ormRepo: Repository<ShippingZoneCountries>;

  constructor(dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(ShippingZoneCountries);
  }

  async findByCountryCode(countryCode: string): Promise<ShippingZoneCountries | null> {
    return this.ormRepo.findOne({
      where: { countryCode }, // usar camelCase conforme a entidade
      relations: ['zone'], // inclui a zona associada
    });
  }

  async create(data: { countryCode: string; zone: ShippingZone }): Promise<ShippingZoneCountries> {
    const entity = this.ormRepo.create(data);
    return this.ormRepo.save(entity);
  }

  async findAll(): Promise<ShippingZoneCountries[]> {
    return this.ormRepo.find({ relations: ['zone'] });
  }
}
