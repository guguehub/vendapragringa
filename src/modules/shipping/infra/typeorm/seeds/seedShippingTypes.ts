import dataSource from '@shared/infra/typeorm';
import { ShippingTypesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingTypesRepository';

async function seedShippingTypes() {
  await dataSource.initialize();

  const repository = new ShippingTypesRepository();

  const existing = await repository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Tipos de frete já inseridos. Pulando...');
    return;
  }

  await repository.createMany([
    { name: 'document' }, // Registro Internacional / Prioritário Internacional
    { name: 'product' },  // Serviços com rastreio (acima de 2kg, ex: courier)
  ]);

  console.log('[Seed] Tipos de frete inseridos com sucesso!');
}

export default seedShippingTypes;
