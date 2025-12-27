import 'reflect-metadata';
import '@shared/container';
import dataSource from '@shared/infra/typeorm/data-source';
import { container } from 'tsyringe';
import chalk from 'chalk';
import cron from 'node-cron';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import ResetDailyBonusService from '@modules/user_quota/services/ResetDailyBonusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

/**
 * 🎁 Configuração de bônus diário (em raspagens)
 */
const DailyBonusPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 3,
  [SubscriptionTier.BRONZE]: 5, // bronze não recebe bônus diário
  [SubscriptionTier.SILVER]: 10,
  [SubscriptionTier.GOLD]: 15,
  [SubscriptionTier.INFINITY]: 9999, // ilimitado (modo teste)
};

/**
 * 🔁 Função principal para aplicar bônus diário
 */
export async function runDailyBonusOnce() {
  console.log(chalk.cyan(`\n⏰ Executando bônus diário (manual ou agendado)...`));

  let totalUsuarios = 0;
  let totalBonusAplicado = 0;

  try {
    // 🧩 Inicializa conexão com o banco, se necessário
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log(chalk.gray('📡 DataSource inicializado pelo Daily Bonus CRON.'));
    }

    const usersRepository = new UsersRepository();
    const resetDailyBonusService = container.resolve(ResetDailyBonusService);

    const users = await usersRepository.findAllWithSubscriptions();

    for (const user of users) {
      const tier = (user.subscriptions?.[0]?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
      const bonusAmount = DailyBonusPerTier[tier] || 0;

      if (bonusAmount > 0) {
        await resetDailyBonusService.execute(user.id, bonusAmount);
        totalUsuarios++;
        totalBonusAplicado += bonusAmount;

        console.log(
          chalk.greenBright(
            `🎁 +${bonusAmount} raspagens adicionadas para ${user.email ?? user.id} (${tier})`
          )
        );
      } else {
        console.log(
          chalk.gray(`- ${user.email ?? user.id} (${tier}) não possui bônus diário.`)
        );
      }
    }

    console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(
      chalk.green(
        `🎯 Bônus diário concluído — ${totalUsuarios} usuários beneficiados, total de ${totalBonusAplicado} raspagens adicionadas.`
      )
    );
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  } catch (error) {
    console.error(chalk.red('❌ Erro ao aplicar bônus diário:'), error);
  }
}

/**
 * 🕒 Agendamento automático (modo teste ou diário)
 * - testMode = true → executa a cada 30s
 * - testMode = false → executa diariamente às 00:00
 */
export function scheduleDailyBonus(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 * * *';
  const modeText = testMode ? chalk.yellow('TEST MODE (30s)') : chalk.blue('DAILY BONUS (00:00)');

  console.log(chalk.cyan(`🚀 Daily Bonus agendado: ${modeText}`));

  cron.schedule(schedule, async () => {
    console.log(chalk.gray('\n🕐 Executando ciclo agendado de bônus diário...'));
    await runDailyBonusOnce();
  });
}

/**
 * 🚀 Execução direta via linha de comando
 */
if (require.main === module) {
  runDailyBonusOnce();
}
