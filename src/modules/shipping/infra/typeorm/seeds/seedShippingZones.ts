import { DataSource } from 'typeorm';
import { ShippingZonesRepository } from '../repositories/ShippingZonesRepository';

interface ZoneSeed {
  name: string;
  code: string;
}

export default async function seedShippingZones(dataSource: DataSource): Promise<void> {
  const repository = new ShippingZonesRepository(dataSource);

  const zones: ZoneSeed[] = [
    { name: 'Estados Unidos', code: 'US' },
    { name: 'Reino Unido', code: 'GB' },
    { name: 'Alemanha', code: 'DE' },
    { name: 'França', code: 'FR' },
    { name: 'Holanda', code: 'NL' },
    { name: 'Espanha', code: 'ES' },
    { name: 'Itália', code: 'IT' },
    { name: 'Europa (restante)', code: 'EU' },
    { name: 'América Latina', code: 'LATAM' },
    { name: 'Asia', code: 'ASIA' },
    { name: 'Oriente Médio', code: 'ME' },
  ];

  let createdCount = 0;

  for (const zone of zones) {
    const exists = await repository.findByCode(zone.code);
    if (!exists) {
      await repository.create(zone);
      createdCount++;
      console.log(`[Seed] Zona '${zone.name}' criada`);
    }
  }

  if (createdCount > 0) {
    console.log(`[Seed] ${createdCount} zona(s) criada(s)`);
  } else {
    console.log('[Seed] Nenhuma zona nova criada');
  }
}
