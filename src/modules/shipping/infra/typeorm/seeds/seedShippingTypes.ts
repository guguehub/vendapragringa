import dataSource from '@shared/infra/typeorm';
import { ShippingTypesRepository } from '../repositories/ShippingTypesRepository';

async function seedShippingTypes() {
  await dataSource.initialize();

  const repository = new ShippingTypesRepository();

  const types: { name: string; code: 'document' | 'product' }[] = [
  { name: 'Documento', code: 'document' },
  { name: 'Produto', code: 'product' },
];

  for (const type of types) {
    const exists = await repository.findByCode(type.code);
    if (!exists) {
      await repository.create(type);
      console.log(`[Seed] Tipo de envio '${type.name}' criado`);
    }
  }
}

export default seedShippingTypes;
