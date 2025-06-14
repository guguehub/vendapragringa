import { DataSource } from 'typeorm';
import { ShippingPricesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingPricesRepository';
import { ShippingZonesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZonesRepository';
import { ShippingTypesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingTypesRepository';
import { ShippingWeightsRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingWeightsRepository';
import { isRegionCode } from '@modules/shipping/utils/regionGroups';
import { ShippingTypeCode } from '@modules/shipping/enums/ShippingTypeCode';

async function seedShippingPricesProducts(dataSource: DataSource) {
  const pricesRepository = new ShippingPricesRepository(dataSource);
  const typesRepository = new ShippingTypesRepository(dataSource);
  const zonesRepository = new ShippingZonesRepository(dataSource);
  const weightsRepository = new ShippingWeightsRepository(dataSource);

  const productType = await typesRepository.findByCode(ShippingTypeCode.PRODUCT);
  if (!productType) {
    console.error('Tipo "product" não encontrado');
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
      { maxWeight: 100, price: 55.05 },
      { maxWeight: 250, price: 71.60 },
      { maxWeight: 500, price: 96.90 },
      { maxWeight: 1000, price: 128.85 },
      { maxWeight: 2000, price: 186.80 },
      { maxWeight: 3000, price: 240.60 },
      { maxWeight: 5000, price: 328.80 },
    ],
    II: [
      { maxWeight: 100, price: 59.90 },
      { maxWeight: 250, price: 79.80 },
      { maxWeight: 500, price: 107.20 },
      { maxWeight: 1000, price: 142.85 },
      { maxWeight: 2000, price: 214.30 },
      { maxWeight: 3000, price: 287.90 },
      { maxWeight: 5000, price: 393.90 },
    ],
    III: [
      { maxWeight: 100, price: 62.90 },
      { maxWeight: 250, price: 83.20 },
      { maxWeight: 500, price: 112.20 },
      { maxWeight: 1000, price: 149.35 },
      { maxWeight: 2000, price: 223.30 },
      { maxWeight: 3000, price: 299.60 },
      { maxWeight: 5000, price: 410.90 },
    ],
    IV: [
      { maxWeight: 100, price: 65.80 },
      { maxWeight: 250, price: 88.40 },
      { maxWeight: 500, price: 120.05 },
      { maxWeight: 1000, price: 159.70 },
      { maxWeight: 2000, price: 238.25 },
      { maxWeight: 3000, price: 316.85 },
      { maxWeight: 5000, price: 435.00 },
    ],
    V: [
      { maxWeight: 100, price: 75.10 },
      { maxWeight: 250, price: 101.70 },
      { maxWeight: 500, price: 138.50 },
      { maxWeight: 1000, price: 186.25 },
      { maxWeight: 2000, price: 276.10 },
      { maxWeight: 3000, price: 365.15 },
      { maxWeight: 5000, price: 495.60 },
    ],
  };

  const pricesData = [];

  for (const regionCode of Object.keys(regionGroups)) {
    if (!isRegionCode(regionCode)) {
      throw new Error(`Código de região inválido: ${regionCode}`);
    }

    const groupKey = regionGroups[regionCode];
    const priceEntries = regionGroupPrices[groupKey];

    const zone = await zonesRepository.findByCountryCode(regionCode);
    if (!zone) {
      console.warn(`[Seed] Zona com código ${regionCode} não encontrada`);
      continue;
    }

    for (const entry of priceEntries) {
      const weightInKg = entry.maxWeight / 1000;

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
        type_id: productType.id,
        zone_id: zone.id,
        weight_id: weightRange.id,
        price: entry.price,
      });
    }
  }

  await pricesRepository.createMany(pricesData);

  console.log('[Seed] Preços de frete para produtos inseridos com sucesso!');
}

export default seedShippingPricesProducts;
