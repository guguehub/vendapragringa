import dataSource from '@shared/infra/typeorm';
import { ShippingZonesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZonesRepository';

async function seedShippingZones() {
  await dataSource.initialize();

  const repository = new ShippingZonesRepository();

  const existing = await repository.findAll();
  if (existing.length > 0) {
    console.log('[Seed] Zonas de frete já existem. Pulando...');
    return;
  }

  await repository.createMany([
    { name: 'Estados Unidos', country_code: 'US' },
    { name: 'Canadá', country_code: 'CA' },
    { name: 'Reino Unido', country_code: 'GB' },
    { name: 'Alemanha', country_code: 'DE' },
    { name: 'França', country_code: 'FR' },
    { name: 'Itália', country_code: 'IT' },
    { name: 'Espanha', country_code: 'ES' },
    { name: 'Portugal', country_code: 'PT' },
    { name: 'Outros', country_code: 'ZZ' }, // "ZZ" como país genérico para resto do mundo
  ]);

  console.log('[Seed] Zonas de frete inseridas com sucesso!');
}

export default seedShippingZones;
