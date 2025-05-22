import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';

import ShippingType from '../../entities/ShippingType';
import ShippingZone from '../../entities/ShippingZone';
import ShippingWeight from '../../entities/ShippingWeight';
import ShippingPrice from '../../entities/ShippingPrice';

export default async function runShippingSeed(): Promise<void> {
  const shippingTypeRepo = dataSource.getRepository(ShippingType);
  const shippingZoneRepo = dataSource.getRepository(ShippingZone);
  const shippingWeightRepo = dataSource.getRepository(ShippingWeight);
  const shippingPriceRepo = dataSource.getRepository(ShippingPrice);

  // 1. Tipos de frete
  const types = [
    { id: uuidv4(), name: 'Documentos' },
    { id: uuidv4(), name: 'Produtos' },
  ];

  // 2. Zonas de envio
  const zones = [
    { id: uuidv4(), name: 'América do Norte', country_code: 'US' },
    { id: uuidv4(), name: 'Reino Unido', country_code: 'GB' },
    { id: uuidv4(), name: 'Alemanha', country_code: 'DE' },
    { id: uuidv4(), name: 'França', country_code: 'FR' },
    { id: uuidv4(), name: 'Outros', country_code: 'OT' },
  ];

  // 3. Faixas de peso
  const weights = [
    { id: uuidv4(), min_weight: 0, max_weight: 0.1 },
    { id: uuidv4(), min_weight: 0.101, max_weight: 0.25 },
    { id: uuidv4(), min_weight: 0.251, max_weight: 0.5 },
    { id: uuidv4(), min_weight: 0.501, max_weight: 1 },
    { id: uuidv4(), min_weight: 1.01, max_weight: 2 },
    { id: uuidv4(), min_weight: 2.01, max_weight: 3 },
    { id: uuidv4(), min_weight: 3.01, max_weight: 5 },
  ];

  await shippingTypeRepo.save(types);
  await shippingZoneRepo.save(zones);
  await shippingWeightRepo.save(weights);

  // 4. Preços de frete (exemplo real)
  const prices = [
    {
      id: uuidv4(),
      type_id: types[0].id, // Documentos
      zone_id: zones[0].id, // EUA
      weight_id: weights[0].id, // 0-100g
      price: 17.85 + 37.20,
    },
    {
      id: uuidv4(),
      type_id: types[0].id, // Documentos
      zone_id: zones[1].id, // Reino Unido
      weight_id: weights[0].id, // 0-100g
      price: 22.50 + 40.40,
    },
    {
      id: uuidv4(),
      type_id: types[1].id, // Produtos
      zone_id: zones[0].id, // EUA
      weight_id: weights[3].id, // 501g–1kg
      price: 89.90,
    },
  ];

  await shippingPriceRepo.save(prices);

  console.log('✅ Dados de frete inseridos com sucesso!');
}
