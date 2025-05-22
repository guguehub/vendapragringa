import dataSource from '@shared/infra/typeorm';
import { ShippingWeightsRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingWeightsRepository';

async function seedShippingWeights() {
  await dataSource.initialize();

  const repository = new ShippingWeightsRepository();

  const existing = await repository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Faixas de peso já existem. Pulando...');
    return;
  }

  await repository.createMany([
    { min_kg: 0, max_kg: 0.1 },     // 0–100g
    { min_kg: 0.101, max_kg: 0.25 }, // 101–250g
    { min_kg: 0.251, max_kg: 0.5 },  // 251–500g
    { min_kg: 0.501, max_kg: 1 },    // 501g–1kg
    { min_kg: 1.01, max_kg: 2 },     // 1.01–2kg
    { min_kg: 2.01, max_kg: 3 },     // 2.01–3kg
    { min_kg: 3.01, max_kg: 5 },     // 3.01–5kg
  ]);

  console.log('[Seed] Faixas de peso inseridas com sucesso!');
}

export default seedShippingWeights;
