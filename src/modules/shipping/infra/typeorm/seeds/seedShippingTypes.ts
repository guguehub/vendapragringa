import { ShippingTypesRepository } from '../repositories/ShippingTypesRepository';
import { ShippingTypeCode } from '@modules/shipping/enums/ShippingTypeCode';
import dataSource from '../../../../../shared/infra/typeorm/index'

async function seedShippingTypes(): Promise<void> {
  const repository = new ShippingTypesRepository(dataSource);

  const types: { name: string; code: ShippingTypeCode }[] = [
    { name: 'Documento', code: ShippingTypeCode.DOCUMENT },
    { name: 'Produto', code: ShippingTypeCode.PRODUCT },
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
