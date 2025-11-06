import 'reflect-metadata';
import { container } from 'tsyringe';
import dataSource from '../shared/infra/typeorm/data-source';
import CreateItemScrapeLogService from '../modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '../modules/item_scrape_log/enums/item-scrape-action.enum';
import UserQuotaService from '../modules/user_quota/services/UserQuotaService';
import User from '../modules/users/infra/typeorm/entities/User';

async function testQuotaFlow() {
  await dataSource.initialize();

  // 🔎 Busca usuário real por e-mail (usa a seed)
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: 'user@vendapragringa.com' } });

  if (!user) {
    console.error('❌ Usuário não encontrado. Rode seedUsers antes.');
    await dataSource.destroy();
    return;
  }

  const user_id = user.id;
  const item_id = 'item-test-uuid'; // ou gere uuidv4() se quiser
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
