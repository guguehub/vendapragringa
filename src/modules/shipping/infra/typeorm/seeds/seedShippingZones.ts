import dataSource from '@shared/infra/typeorm';
import { ShippingZonesRepository } from '../repositories/ShippingZonesRepository';

async function seedShippingZones() {
  await dataSource.initialize();

  const repository = new ShippingZonesRepository();

  const zones = [
    { name: 'Estados Unidos', code: 'US' },
    { name: 'Reino Unido', code: 'GB' },
    { name: 'Alemanha', code: 'DE' },
    { name: 'França', code: 'FR' },
    { name: 'Holanda', code: 'NL' },
    { name: 'Espanha', code: 'ES' },
    { name: 'Itália', code: 'IT' },
    { name: 'Europa (restante)', code: 'EU' },
    { name: 'América Latina', code: 'LATAM' },
    { name: 'Ásia', code: 'ASIA' },
    { name: 'Oriente Médio', code: 'ME' },
  ];

  for (const zone of zones) {
    const exists = await repository.findByCode(zone.code);
    if (!exists) {
      await repository.create(zone);
      console.log(`[Seed] Zona '${zone.name}' criada`);
    }
  }
}

export default seedShippingZones;
