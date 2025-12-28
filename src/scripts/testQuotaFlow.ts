import 'reflect-metadata';
import '@shared/container';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import dataSource from '@shared/infra/typeorm/data-source';

import CreateItemScrapeLogService from '@modules/item_scrape_log/services/CreateItemScrapeLogService';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import ResetDailyBonusService from '@modules/user_quota/services/ResetDailyBonusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { ItemScrapeAction } from '@modules/item_scrape_log/enums/item-scrape-action.enum';
import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item';

// 🎨 Cores utilitárias (com versões "Bright")
const color = {
  blue: (t: string) => chalk.blueBright(t),
  green: (t: string) => chalk.green(t),
  yellow: (t: string) => chalk.yellow(t),
  red: (t: string) => chalk.red(t),
  gray: (t: string) => chalk.gray(t),
  greenBright: (t: string) => chalk.greenBright(t),
  redBright: (t: string) => chalk.redBright(t),
  divider: () => chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
};

/**
 * 🧪 Teste completo de fluxo de quotas (V2)
 * Substitui a versão anterior
 */
async function testQuotaFlow() {
  console.log(color.blue('\n🧩 Iniciando teste de fluxo de quotas (V2)...'));
  await dataSource.initialize();

  try {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: 'user@vendapragringa.com' },
    });

    if (!user) {
      console.error(color.red('❌ Usuário não encontrado. Rode seedUsers antes.'));
      await dataSource.destroy();
      return;
    }

    const user_id = user.id;
    console.log(color.gray(`👤 Testando usuário: ${user.email} (${user_id})`));

    // 🔹 Cria item temporário
    const itemRepository = dataSource.getRepository(Item);
    const newItem = itemRepository.create({
      id: uuidv4(),
      title: 'Item de teste V2',
      description: 'Criado automaticamente pelo script testQuotaFlow',
      itemLink: 'https://example.com/item-teste-v2',
      image_url: 'https://example.com/imagem.jpg',
      price: 0,
      currency: 'USD',
      weight: 0,
      active: true,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    } as Partial<Item>);
    await itemRepository.save(newItem);

    console.log(color.green(`🧱 Item temporário criado com ID: ${newItem.id}`));

    const quotaService = container.resolve(UserQuotaService);
    const logService = container.resolve(CreateItemScrapeLogService);
    const resetDailyBonusService = container.resolve(ResetDailyBonusService);

    console.log(color.divider());
    console.log(color.yellow('⚙️ Etapa 1: Consumo de raspagens'));
    const totalScrapesToUse = 4; // reduzido em 20% para segurança
    for (let i = 0; i < totalScrapesToUse; i++) {
      await quotaService.consumeScrape(user_id);
    }
    console.log(color.green(`✅ ${totalScrapesToUse} raspagens consumidas com sucesso!`));

    await logService.execute({
      item_id: newItem.id,
      user_id,
      action: ItemScrapeAction.SCRAPE_USED,
      details: `Simulação de consumo de ${totalScrapesToUse} raspagens`,
      timestamp: new Date(),
    });

    console.log(color.divider());
    console.log(color.yellow('🎁 Etapa 2: Aplicando bônus diário'));
    await resetDailyBonusService.execute(user_id, 3);
    console.log(color.green('✅ Bônus diário aplicado (+3 raspagens)'));

    console.log(color.divider());
    console.log(color.yellow('💰 Etapa 3: Aplicando recarga mensal'));
    await quotaService.resetMonthlyQuota(user_id, 10);
    console.log(color.green('✅ Recarga mensal aplicada (+10 raspagens base)'));

    console.log(color.divider());
    console.log(color.yellow('⬆️ Etapa 4: Simulando upgrade de plano'));
    await quotaService.resetQuotaForTier(user_id, SubscriptionTier.SILVER);
    console.log(color.green('✅ Quota resetada conforme plano SILVER'));

    console.log(color.divider());
    console.log(color.yellow('🧾 Etapa 5: Auditoria final'));
    await logService.execute({
      item_id: newItem.id,
      user_id,
      action: ItemScrapeAction.BONUS_GRANTED,
      details: 'Auditoria final do fluxo de teste V2',
      timestamp: new Date(),
    });
    console.log(color.green('✅ Log de auditoria salvo com sucesso!'));

    console.log(color.divider());
    console.log(color.yellow('🧼 Limpando item temporário...'));
    await itemRepository.remove(newItem);
    console.log(color.green('✅ Item temporário removido do banco.'));

    console.log(color.divider());
    console.log(color.blue('🎉 Teste completo de quotas finalizado com sucesso!'));
  } catch (err) {
    console.error(color.red('❌ Erro durante o teste:'), err);
  } finally {
    await dataSource.destroy();
    console.log(color.gray('🔌 Conexão com banco encerrada.'));
  }
}

testQuotaFlow()
  .then(() => console.log(color.greenBright('✔️ Teste encerrado com sucesso!')))
  .catch((err) => console.error(color.redBright('🔥 Erro fatal no teste:'), err));
