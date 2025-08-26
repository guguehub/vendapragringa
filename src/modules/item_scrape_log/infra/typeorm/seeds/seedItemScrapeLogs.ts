// src/modules/item_scrape_log/infra/typeorm/seeds/seedItemScrapeLogs.ts
//import dataSource from '@shared/infra/typeorm';
import ItemScrapeLog from '../entities/ItemScrapeLog';
import dataSource from '@shared/infra/typeorm/data-source';

export default async function seedItemScrapeLogs() {
  await dataSource.initialize();
  console.log('Banco inicializado para seed ItemScrapeLog');

  // Exemplo simples de seed
  const log = dataSource.getRepository(ItemScrapeLog).create({
    item_id: 'example-item-id',
    user_id: 'example-user-id',
    listed_on_ebay: false,
  });

  await dataSource.getRepository(ItemScrapeLog).save(log);
  console.log('Seed de ItemScrapeLog concluída');

  await dataSource.destroy();
}
