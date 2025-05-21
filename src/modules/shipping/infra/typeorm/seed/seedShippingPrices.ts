import dataSource from '@shared/infra/typeorm';
import { ShippingPricesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingPricesRepository';
import { ShippingZonesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZonesRepository';
import { ShippingTypesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingTypesRepository';
import { ShippingWeightsRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingWeightsRepository';

async function seedShippingPrices() {
  await dataSource.initialize();

  const pricesRepository = new ShippingPricesRepository();
  const typesRepository = new ShippingTypesRepository();
  const zonesRepository = new ShippingZonesRepository();
  const weightsRepository = new ShippingWeightsRepository();

  const existing = await pricesRepository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Preços já existem. Pulando...');
    return;
  }

  const types = await typesRepository.findAll();
  const zones = await zonesRepository.findAll();
  const weights = await weightsRepository.findAll();

  const pricesData = [];

  for (const type of types) {
    for (const zone of zones) {
      for (const weight of weights) {
        // 💡 Exemplo de regra:
        // - Documento = base 20 + peso * 50
        // - Produto = base 35 + peso * 65
        const base = type.name === 'document' ? 20 : 35;
        const perKg = type.name === 'document' ? 50 : 65;
        const midWeight = (weight.min_kg + weight.max_kg) / 2;

        const price = Number((base + perKg * midWeight).toFixed(2));

        pricesData.push({
          type_id: type.id,
          zone_id: zone.id,
          weight_id: weight.id,
          price,
        });
      }
    }
  }

  await pricesRepository.createMany(pricesData);

  console.log('[Seed] Preços de frete inseridos com sucesso!');
}

export default seedShippingPrices;
