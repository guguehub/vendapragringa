import { DataSource } from 'typeorm';
import { ShippingWeightsRepository } from '../repositories/ShippingWeightsRepository';

interface ShippingWeightSeed {
  min_kg: number;
  max_kg: number;
}

export default async function seedShippingWeights(dataSource: DataSource): Promise<void> {
  const repository = new ShippingWeightsRepository(dataSource);

  const existing = await repository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Faixas de peso já existem. Pulando...');
    return;
  }

  const weights: ShippingWeightSeed[] = [
    { min_kg: 0, max_kg: 0.1 },       // 0–100g
    { min_kg: 0.101, max_kg: 0.25 },  // 101–250g
    { min_kg: 0.251, max_kg: 0.5 },   // 251–500g
    { min_kg: 0.501, max_kg: 1 },     // 501g–1kg
    { min_kg: 1.01, max_kg: 2 },      // 1.01–2kg
    { min_kg: 2.01, max_kg: 3 },      // 2.01–3kg
    { min_kg: 3.01, max_kg: 5 },      // 3.01–5kg
  ];

  await repository.createMany(weights);

  console.log(`[Seed] Faixas de peso: ${weights.length} faixas inseridas.`);
}
