import { DataSource, Repository } from 'typeorm';
import ShippingZoneCountry from '../entities/ShippingZoneCountry';
import ShippingZone from '../entities/ShippingZone';

export class ShippingZoneCountryRepository {
  private ormRepository: Repository<ShippingZoneCountry>;

  constructor(private dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(ShippingZoneCountry);
  }

  /**
   * Retorna a ShippingZone associada a um código de país (ISO Alpha-2).
   * Ex: 'US' => Zona correspondente aos EUA.
   */
  async findByCountryCode(countryCode: string): Promise<ShippingZone | null> {
    const zoneCountry = await this.ormRepository.findOne({
      where: { countryCode },
      relations: ['zone'],
    });

    return zoneCountry?.zone || null;
  }

  /**
   * Cria várias associações entre códigos de países e zonas.
   */
  async createMany(entries: Array<{ countryCode: string; zone: ShippingZone }>): Promise<void> {
    const zoneCountries = entries.map(({ countryCode, zone }) =>
      this.ormRepository.create({ countryCode, zone }),
    );

    await this.ormRepository.save(zoneCountries);
  }

  /**
   * Lista todos os países associados a uma determinada zona.
   */
  async listCountriesByZone(zoneId: string): Promise<ShippingZoneCountry[]> {
    return this.ormRepository.find({
      where: { zone: { id: zoneId } },
      relations: ['zone'],
    });
  }

  /**
   * Retorna todas as associações entre países e zonas.
   */
  async findAll(): Promise<ShippingZoneCountry[]> {
    return this.ormRepository.find({ relations: ['zone'] });
  }
}
