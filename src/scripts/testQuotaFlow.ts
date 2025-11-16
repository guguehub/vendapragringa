import 'reflect-metadata';
import '@shared/container';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import dataSource from '@shared/infra/typeorm/data-source';

import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item'; // ✅ path revisado

async function testQuotaFlow() {
  console.log('🧩 Iniciando teste de fluxo de quotas e logs...');
  await dataSource.initialize();

  // 🔎 Busca usuário de seed
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: 'user@vendapragringa.com' } });

  if (!user) {
    console.error('❌ Usuário não encontrado. Rode seedUsers antes.');
    await dataSource.destroy();
    return;
  }

  const user_id = user.id;

  // 🔹 Cria item real temporário vinculado ao user
  const itemRepository = dataSource.getRepository(Item);

  const newItem = itemRepository.create({
    id: uuidv4(),
    title: 'Item de teste para log de raspagem',
    description: 'Criado automaticamente pelo script testQuotaFlow',
    itemLink: 'https://example.com/item-teste',
    image_url: 'https://example.com/imagem.jpg',
    price: 0,
    currency: 'USD',
    weight: 0,
    active: true,
    user_id,
    created_at: new Date(),
    updated_at: new Date(),
  } as Partial<Item>); // ✅ usa Partial<Item> compatível com TypeORM

  await itemRepository.save(newItem);
  const item_id = newItem.id;

  console.log(`🧱 Item criado com ID: ${item_id}`);

  // 🔹 Instancia serviços
  const quotaService = container.resolve(UserQuotaService);
  const logService = container.resolve(CreateItemScrapeLogService);

  // 🔸 Consome 1 unidade de raspagem
  console.log('⚙️ Consumindo 1 unidade de raspagem...');
  await quotaService.consumeScrape(user_id, item_id);
  console.log('✅ Raspagem consumida com sucesso!');

  // 🔸 Cria log manual
  console.log('🧾 Criando log manual...');
  await logService.execute({
    item_id,
    user_id,
    action: ItemScrapeAction.SCRAPE_USED,
    details: 'Teste de uso de raspagem manual via script',
    timestamp: new Date(),
  });
  console.log('✅ Log criado com sucesso!');

  // 🔸 Simula reset diário
  console.log('🧹 Simulando reset diário de bônus...');
  await logService.execute({
    user_id,
    action: ItemScrapeAction.DAILY_BONUS_RESET,
    details: 'Reset diário simulado via script',
    timestamp: new Date(),
  });
  console.log('✅ Reset diário registrado.');

  // 🔹 Remove o item temporário
  await itemRepository.remove(newItem);
  console.log('🧼 Item temporário removido do banco.');

  await dataSource.destroy();
  console.log('🎉 Teste completo e conexão encerrada.');
}

testQuotaFlow()
  .then(() => console.log('✔️ Finalizado com sucesso!'))
  .catch(err => console.error('❌ Erro no teste:', err));
