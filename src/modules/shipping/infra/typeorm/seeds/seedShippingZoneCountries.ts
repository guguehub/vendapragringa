import { DataSource } from 'typeorm';
import { ShippingZonesRepository } from '../repositories/ShippingZonesRepository';
import { ShippingZoneCountriesRepository } from '../repositories/ShippingZoneCountriesRepository';
import ShippingZoneCountries from '../entities/ShippingZoneCountries';

interface CountryAssociation {
  countryCode: string; // Ex: 'BR', 'MX', 'US'
  zoneCode: string;    // Código da zona existente: 'US', 'EU', etc.
}

export default async function seedShippingZoneCountries(dataSource: DataSource): Promise<void> {
  const zonesRepository = new ShippingZonesRepository(dataSource);
  const zonesCountriesRepository = new ShippingZoneCountriesRepository(dataSource);

  const associations: CountryAssociation[] = [
    { countryCode: 'US', zoneCode: 'US' },
    { countryCode: 'PR', zoneCode: 'US' },
    { countryCode: 'GB', zoneCode: 'GB' },
    { countryCode: 'DE', zoneCode: 'DE' },
    { countryCode: 'FR', zoneCode: 'FR' },
    { countryCode: 'NL', zoneCode: 'NL' },
    { countryCode: 'ES', zoneCode: 'ES' },
    { countryCode: 'IT', zoneCode: 'IT' },
    { countryCode: 'PT', zoneCode: 'EU' },
    { countryCode: 'SE', zoneCode: 'EU' },
    { countryCode: 'NO', zoneCode: 'EU' },
    { countryCode: 'IE', zoneCode: 'EU' },
    { countryCode: 'MX', zoneCode: 'LATAM' },
    { countryCode: 'AR', zoneCode: 'LATAM' },
    { countryCode: 'CL', zoneCode: 'LATAM' },
    { countryCode: 'BR', zoneCode: 'LATAM' },
    { countryCode: 'CN', zoneCode: 'ASIA' },
    { countryCode: 'JP', zoneCode: 'ASIA' },
    { countryCode: 'KR', zoneCode: 'ASIA' },
    { countryCode: 'AE', zoneCode: 'ME' },
    { countryCode: 'SA', zoneCode: 'ME' },
  ];

  for (const assoc of associations) {
    const zone = await zonesRepository.findByCode(assoc.zoneCode);
    if (!zone) {
      console.warn(`[Seed] Zona com código ${assoc.zoneCode} não encontrada`);
      continue;
    }

    const existing = await zonesCountriesRepository.findByCountryCode(assoc.countryCode);
    if (existing) continue;

    await zonesCountriesRepository.create({
      countryCode: assoc.countryCode, // <-- CORREÇÃO: usar countryCode, não country_code
      zone,
    });

    console.log(`[Seed] ✅ Associação criada: '${assoc.countryCode}' -> '${zone.name}'`);
  }

  console.log('[Seed] Seed de associações de países finalizado');
}
