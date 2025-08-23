// src/modules/item/infra/typeorm/seeds/seedItems.ts
import { DataSource } from 'typeorm';
import Item from '../entities/Item';
//import dataSource from '../../../../../shared/infra/typeorm/index';
import dataSource from '@shared/infra/typeorm/data-source';

const itemsSeed = [
  {
    userId: 'COLOQUE_O_ID_DE_UM_USUARIO_EXISTENTE',
    title: 'Exemplo de Item 1',
    description: 'Descrição do item 1',
    price: 10.99,
    external_id: 'ML123456',
    marketplace: 'mercadolivre',
    status: 'ready',
    import_stage: 'draft',
  },
  {
    userId: 'COLOQUE_O_ID_DE_UM_USUARIO_EXISTENTE',
    title: 'Exemplo de Item 2',
    description: 'Descrição do item 2',
    price: 20.5,
    external_id: 'OLX98765',
    marketplace: 'olx',
    status: 'ready',
    import_stage: 'draft',
  },
];

export default async function seedItems() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Item);
  for (const item of itemsSeed) {
    const exists = await repo.findOne({ where: { external_id: item.external_id } });
    if (!exists) {
      const newItem = repo.create(item);
      await repo.save(newItem);
      console.log(`Item criado: ${item.title}`);
    }
  }
  await dataSource.destroy();
}
