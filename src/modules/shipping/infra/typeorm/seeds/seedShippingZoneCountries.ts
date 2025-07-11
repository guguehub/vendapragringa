import { DataSource } from 'typeorm';
import ShippingZone from '../entities/ShippingZone';
import ShippingZoneCountry from '../entities/ShippingZoneCountry';

export async function seedShippingZoneCountries(dataSource: DataSource): Promise<void> {
  const zoneRepository = dataSource.getRepository(ShippingZone);
  const zoneCountryRepository = dataSource.getRepository(ShippingZoneCountry);

  // Lista de países e suas zonas correspondentes
  const data: Array<{ countryCode: string; zoneName: string }> = [
    { countryCode: 'US', zoneName: 'EUA' },
    { countryCode: 'PR', zoneName: 'EUA' },
    { countryCode: 'GB', zoneName: 'Reino Unido' },
    { countryCode: 'DE', zoneName: 'Alemanha' },
    { countryCode: 'FR', zoneName: 'França' },
    { countryCode: 'NL', zoneName: 'Holanda' },
    { countryCode: 'ES', zoneName: 'Espanha' },
    { countryCode: 'IT', zoneName: 'Itália' },
    { countryCode: 'PT', zoneName: 'Europa' },
    { countryCode: 'SE', zoneName: 'Europa' },
    { countryCode: 'NO', zoneName: 'Europa' },
    { countryCode: 'IE', zoneName: 'Europa' },
    { countryCode: 'MX', zoneName: 'América Latina' },
    { countryCode: 'AR', zoneName: 'América Latina' },
    { countryCode: 'CL', zoneName: 'América Latina' },
    { countryCode: 'BR', zoneName: 'América Latina' },
    { countryCode: 'CN', zoneName: 'Ásia' },
    { countryCode: 'JP', zoneName: 'Ásia' },
    { countryCode: 'KR', zoneName: 'Ásia' },
    { countryCode: 'AE', zoneName: 'Oriente Médio' },
    { countryCode: 'SA', zoneName: 'Oriente Médio' },
  ];

  for (const { countryCode, zoneName } of data) {
    const zone = await zoneRepository.findOne({ where: { name: zoneName } });

    if (!zone) {
      console.warn(`[Seed] ⚠️ Zona não encontrada: "${zoneName}"`);
      continue;
    }

    const alreadyExists = await zoneCountryRepository.findOne({
      where: {
        countryCode,
        zone: { id: zone.id },
      },
      relations: ['zone'],
    });

    if (alreadyExists) {
      console.log(`[Seed] ❎ Associação já existente: '${countryCode}' -> '${zoneName}'`);
      continue;
    }

    const newAssociation = zoneCountryRepository.create({
      countryCode,
      zone,
    });

    await zoneCountryRepository.save(newAssociation);
    console.log(`[Seed] ✅ Associação criada: '${countryCode}' -> '${zoneName}'`);
  }
}
