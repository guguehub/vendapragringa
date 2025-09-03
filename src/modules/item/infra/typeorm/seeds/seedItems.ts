// src/modules/item/infra/typeorm/seeds/seedItems.ts
import dataSource from '@shared/infra/typeorm/data-source';
import Item from '../entities/Item';

const itemsSeed: Partial<Item>[] = [
  {
    title: 'Exemplo de Item 1',
    description: 'Descrição do item 1',
    price: 10.99,
    externalId: 'ML123456',
    marketplace: 'mercadolivre',
    status: 'ready',
    importStage: 'draft',
    createdBy: 'system',
  },
  {
    title: 'Exemplo de Item 2',
    description: 'Descrição do item 2',
    price: 20.5,
    externalId: 'OLX98765',
    marketplace: 'olx',
    status: 'ready',
    importStage: 'draft',
    createdBy: 'system',
  },
];

export default async function seedItems(): Promise<void> {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Item);

  for (const item of itemsSeed) {
    const exists = await repo.findOne({
      where: { externalId: item.externalId, marketplace: item.marketplace },
    });

    if (!exists) {
      const newItem = repo.create(item);
      await repo.save(newItem);
      console.log(`✅ Item criado: ${item.title}`);
    } else {
      console.log(`⚠️ Item já existe: ${item.title}`);
    }
  }

  await dataSource.destroy();
  console.log('🌱 Seed de Items finalizada!');
}

// 👉 Chamada direta quando rodar `yarn seed:items`
seedItems().catch(err => {
  console.error('❌ Erro ao rodar seedItems:', err);
  process.exit(1);
});
