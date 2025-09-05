import { DataSource } from 'typeorm';
import { ShippingTypesRepository } from '../repositories/ShippingTypesRepository';
import { ShippingTypeCode } from '../../../enums/ShippingTypeCode';

interface ShippingTypeSeed {
  name: string;
  code: ShippingTypeCode;
}

export default async function seedShippingTypes(dataSource: DataSource): Promise<void> {
  const repository = new ShippingTypesRepository(dataSource);

  const types: ShippingTypeSeed[] = [
    { name: 'Documento', code: ShippingTypeCode.DOCUMENT },
    { name: 'Produto', code: ShippingTypeCode.PRODUCT },
  ];

  let createdCount = 0;

  for (const type of types) {
    const exists = await repository.findByCode(ShippingTypeCode.PRODUCT);

    if (!exists) {
      await repository.create(type);
      createdCount++;
    }
  }

  if (createdCount > 0) {
    console.log(`[Seed] Tipos de envio: ${createdCount} novo(s) inserido(s).`);
  } else {
    console.log(`[Seed] Tipos de envio: nenhum novo inserido.`);
  }
}
