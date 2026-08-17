import 'reflect-metadata';
import '@shared/container';
import chalk from 'chalk';
import dataSource from '@shared/infra/typeorm/data-source';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';

const color = {
  green: (t: string) => chalk.greenBright(t),
  yellow: (t: string) => chalk.yellowBright(t),
  red: (t: string) => chalk.redBright(t),
  divider: () => chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
};

async function simulateUserTest(email: string, delayMs: number) {
  const userRepository = dataSource.getRepository(User);
  const itemRepository = dataSource.getRepository(Item);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    console.log(color.red(`❌ Usuário ${email} não encontrado.`));
    return;
  }

  const quotaService = container.resolve(UserQuotaService);
  const logService = container.resolve(CreateItemScrapeLogService);

  const newItem = itemRepository.create({
    id: uuidv4(),
    title: `Item de teste paralelo (${email})`,
    description: 'Teste concorrente leve',
    user_id: user.id,
    active: true,
  } as Partial<Item>);
  await itemRepository.save(newItem);

  console.log(color.yellow(`⚙️ [${email}] iniciando consumo paralelo...`));
  await quotaService.consumeScrape(user.id);
  await logService.execute({
    item_id: newItem.id,
    user_id: user.id,
    action: ItemScrapeAction.SCRAPE_USED,
    details: 'Teste concorrente leve',
  });
  console.log(color.green(`✅ [${email}] raspagem registrada com sucesso!`));

  await itemRepository.remove(newItem);
  console.log(color.yellow(`🧼 [${email}] item temporário removido.`));

  // aguarda leve atraso antes do próximo
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function testParallel() {
  console.log(chalk.cyan('\n⚙️ Iniciando teste paralelo leve de 2 usuários...'));
  await dataSource.initialize();

  try {
    await simulateUserTest('user@vendapragringa.com', 1000);
    await simulateUserTest('user@teste.com', 1000);

    console.log(color.divider());
    console.log(color.green('🎉 Teste paralelo leve finalizado com sucesso!'));
  } catch (err) {
    console.error(color.red('❌ Erro no teste paralelo:'), err);
  } finally {
    await dataSource.destroy();
    console.log(chalk.gray('🔌 Conexão encerrada.'));
  }
}

testParallel();
