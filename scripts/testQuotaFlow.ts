import 'reflect-metadata';
import { container } from 'tsyringe';
import dataSource from '../src/shared/infra/typeorm/data-source';
import CreateItemScrapeLogService from '../src/modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '../src/modules/item_scrape_log/enums/item-scrape-action.enum';
import UserQuotaService from '../src/modules/user_quota/services/UserQuotaService';

async function testQuotaFlow() {
  await dataSource.initialize();

  const user_id = 'user-test-uuid';
  const item_id = 'item-test-uuid';

  const quotaService = container.resolve(UserQuotaService);
  const logService = container.resolve(CreateItemScrapeLogService);

  console.log('⚙️ Teste: Consumo de raspagem...');
  await quotaService.consumeScrape(user_id, item_id);

  console.log('✅ Raspagem usada! Criando log manual...');
  await logService.execute({
    item_id,
    user_id,
    action: ItemScrapeAction.SCRAPE_USED,
    details: 'Teste de uso de raspagem manual',
    timestamp: new Date(),
  });

  console.log('🧹 Reset diário de bônus...');
  await logService.execute({
    user_id,
    action: ItemScrapeAction.DAILY_BONUS_RESET,
    details: 'Reset diário de bônus simulado',
    timestamp: new Date(),
  });

  console.log('🎉 Teste completo!');
  await dataSource.destroy();
}

testQuotaFlow()
  .then(() => console.log('✔️ Finalizado com sucesso!'))
  .catch(err => console.error('❌ Erro no teste:', err));
