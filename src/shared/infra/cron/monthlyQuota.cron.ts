import 'reflect-metadata';
import '@shared/container';
import dataSource from '@shared/infra/typeorm/data-source';
import { container } from 'tsyringe';
import cron from 'node-cron';
import chalk from 'chalk';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

/**
 * 💰 Definição de recarga mensal por tier (raspagens totais)
 */
const MonthlyQuotaPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.BRONZE]: 5,
  [SubscriptionTier.SILVER]: 10,
  [SubscriptionTier.GOLD]: 15,
  [SubscriptionTier.INFINITY]: 9999, // para modo teste
};

/**
 * 🔁 Função principal — recarga mensal
 */
export async function runMonthlyQuotaOnce() {
  console.log(chalk.cyan(`\n💰 Executando recarga mensal de raspagens...`));

  let totalUsuarios = 0;
  let totalRaspagensAplicadas = 0;

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log(chalk.gray('📡 DataSource inicializado pelo Monthly Quota CRON.'));
    }

    const usersRepository = new UsersRepository();
    const userQuotaService = container.resolve(UserQuotaService);

    const users = await usersRepository.findAllWithSubscriptions();

    for (const user of users) {
      const tier = (user.subscriptions?.[0]?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
      const quotaAmount = MonthlyQuotaPerTier[tier] || 0;

      if (quotaAmount > 0) {
        await userQuotaService.resetMonthlyQuota(user.id, quotaAmount);
        totalUsuarios++;
        totalRaspagensAplicadas += quotaAmount;

        console.log(
          chalk.greenBright(
            `💰 Recarga mensal: +${quotaAmount} raspagens para ${user.email ?? user.id} (${tier})`
          )
        );
      } else {
        console.log(chalk.gray(`- ${user.email ?? user.id} (${tier}) não possui recarga mensal.`));
      }
    }

    console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(
      chalk.green(
        `🎯 Recarga mensal concluída — ${totalUsuarios} usuários beneficiados, total de ${totalRaspagensAplicadas} raspagens aplicadas.`
      )
    );
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  } catch (error) {
    console.error(chalk.red('❌ Erro durante recarga mensal:'), error);
  }
}

/**
 * 🕒 Agendamento automático (modo teste ou produção)
 */
export function scheduleMonthlyQuota(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 1 * *';
  const modeText = testMode ? chalk.yellow('TEST MODE (30s)') : chalk.blue('MONTHLY RECHARGE (dia 1)');

  console.log(chalk.cyan(`🚀 Monthly Quota agendado: ${modeText}`));

  cron.schedule(schedule, async () => {
    console.log(chalk.gray('\n🕐 Executando ciclo agendado de recarga mensal...'));
    await runMonthlyQuotaOnce();
  });
}

/**
 * 🚀 Execução direta via linha de comando
 */
if (require.main === module) {
  runMonthlyQuotaOnce();
}
