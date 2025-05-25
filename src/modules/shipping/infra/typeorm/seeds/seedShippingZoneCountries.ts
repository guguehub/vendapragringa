import { ShippingZonesRepository } from '../repositories/ShippingZonesRepository';
import { ShippingZoneCountriesRepository } from '../repositories/ShippingZoneCountriesRepository';

export async function seedShippingZoneCountries(): Promise<void> {
  const zoneRepo = new ShippingZonesRepository();
  const countryRepo = new ShippingZoneCountriesRepository();

  const mapping: Record<string, string> = {
    // 🇺🇸 América do Norte
    US: 'US',
    CA: 'US',
    MX: 'US',

    // 🇬🇧🇫🇷🇩🇪 Europa
    GB: 'GB', FR: 'FR', DE: 'DE', IT: 'IT', ES: 'ES', NL: 'NL',
    BE: 'EU', PT: 'EU', SE: 'EU', FI: 'EU', IE: 'EU', DK: 'EU',

    // 🇧🇷 América Latina
    BR: 'LATAM', AR: 'LATAM', CL: 'LATAM', CO: 'LATAM', PE: 'LATAM', UY: 'LATAM',

    // 🌏 Ásia
    JP: 'ASIA', CN: 'ASIA', KR: 'ASIA', IN: 'ASIA', SG: 'ASIA', TH: 'ASIA',

    // 🕌 Oriente Médio
    AE: 'ME', SA: 'ME', IL: 'ME', QA: 'ME',

    // 🌍 Outros
    ZA: 'OTHER', AU: 'OTHER', NZ: 'OTHER',
  };

  const countriesToInsert = [];

  for (const [countryCode, zoneCode] of Object.entries(mapping)) {
    const zone = await zoneRepo.findByCode(zoneCode);

    if (zone) {
      const exists = await countryRepo.findByCountryCode(countryCode);
      if (!exists) {
        countriesToInsert.push({ countryCode, zone_id: zone.id });
      }
    }
  }

  if (countriesToInsert.length) {
    await countryRepo.createMany(countriesToInsert);
    console.log(`✅ ${countriesToInsert.length} países associados a zonas de envio.`);
  } else {
    console.log('ℹ️ Nenhum país novo para associar.');
  }
}
