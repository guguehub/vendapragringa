import { DataSource } from 'typeorm';

import { ShippingPricesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingPricesRepository';
import { ShippingZonesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZonesRepository';
import { ShippingTypesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingTypesRepository';
import { ShippingWeightsRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingWeightsRepository';
import { ShippingZoneCountryRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZoneCountriesRepository';
import { isRegionCode } from '@modules/shipping/utils/regionGroups';

async function seedShippingPrices(dataSource: DataSource) {
  const pricesRepository = new ShippingPricesRepository(dataSource);
  const typesRepository = new ShippingTypesRepository(dataSource);
  const zonesRepository = new ShippingZonesRepository(dataSource);
  const weightsRepository = new ShippingWeightsRepository(dataSource);
  const zoneCountryRepository = new ShippingZoneCountryRepository(dataSource);

  // Verifica se já existe algum preço cadastrado para evitar duplicidade
  const existing = await pricesRepository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Preços já existem. Pulando...');
    return;
  }

  // Busca o tipo "document"
  const documentType = await typesRepository.findByCode('document');
  if (!documentType) {
    console.error('Tipo "document" não encontrado');
    return;
  }

  const weights = await weightsRepository.findAll();

  const regionGroups = {
    US: 'I',
    DE: 'II', FR: 'II', NL: 'II', ES: 'II', IT: 'II',
    GB: 'III', EU: 'III',
    LATAM: 'IV',
    ASIA: 'V',
    ME: 'V',
  } as const;

  const regionGroupPrices = {
    I: [
      { maxWeight: 100, price: 23.70 },
      { maxWeight: 250, price: 35.25 },
      { maxWeight: 500, price: 51.90 },
      { maxWeight: 1000, price: 81.10 },
      { maxWeight: 2000, price: 139.55 },
    ],
    II: [
      { maxWeight: 100, price: 28.15 },
      { maxWeight: 250, price: 41.50 },
      { maxWeight: 500, price: 61.10 },
      { maxWeight: 1000, price: 92.10 },
      { maxWeight: 2000, price: 155.55 },
    ],
    III: [
      { maxWeight: 100, price: 30.15 },
      { maxWeight: 250, price: 45.00 },
      { maxWeight: 500, price: 66.35 },
      { maxWeight: 1000, price: 100.25 },
      { maxWeight: 2000, price: 167.30 },
    ],
    IV: [
      { maxWeight: 100, price: 30.35 },
      { maxWeight: 250, price: 47.05 },
      { maxWeight: 500, price: 70.60 },
      { maxWeight: 1000, price: 107.15 },
      { maxWeight: 2000, price: 179.15 },
    ],
    V: [
      { maxWeight: 100, price: 35.85 },
      { maxWeight: 250, price: 56.10 },
      { maxWeight: 500, price: 85.00 },
      { maxWeight: 1000, price: 129.80 },
      { maxWeight: 2000, price: 216.80 },
    ],
  };

  const pricesData = [];

  for (const regionCode of Object.keys(regionGroups)) {
    if (!isRegionCode(regionCode)) {
      throw new Error(`Código de região inválido: ${regionCode}`);
    }

    const groupKey = regionGroups[regionCode];
    const priceEntries = regionGroupPrices[groupKey];

    // Busca zona pelo código do país usando o repositório associativo
    const zone = await zoneCountryRepository.findByCountryCode(regionCode);
    if (!zone) {
      console.warn(`[Seed] Zona com código ${regionCode} não encontrada`);
      continue;
    }

    for (const entry of priceEntries) {
      const weightInKg = entry.maxWeight / 1000;

      // Encontra a faixa de peso correta
      const weightRange = weights.find(
        w => w.min_kg <= weightInKg && w.max_kg >= weightInKg
      );

      if (!weightRange) {
        console.warn(
          `[Seed] Faixa de peso não encontrada para ${entry.maxWeight}g (zona ${regionCode})`
        );
        continue;
      }

      pricesData.push({
        type_id: documentType.id,
        zone_id: zone.id,
        weight_id: weightRange.id,
        price: entry.price,
      });
    }
  }

  await pricesRepository.createMany(pricesData);

  console.log('[Seed] Preços de frete por zona inseridos com sucesso!');
}

export default seedShippingPrices;
