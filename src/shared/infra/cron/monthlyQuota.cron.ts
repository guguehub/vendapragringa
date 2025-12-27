// src/shared/infra/cron/monthlyQuota.cron.ts
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
 * 💰 Definição de recarga mensal por tier
 */
const MonthlyQuotaPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.BRONZE]: 5,
  [SubscriptionTier.SILVER]: 10,
  [SubscriptionTier.GOLD]: 15,
  [SubscriptionTier.INFINITY]: 9999,
};

/**
 * 🔁 Função principal — executa a recarga mensal
 * @param autoMode Define se está sendo chamado automaticamente (sem destroy)
 */
export async function runMonthlyQuotaOnce(autoMode = false) {
  console.log(chalk.cyan(`\n⏰ Iniciando recarga mensal de quotas (${autoMode ? 'modo automático' : 'manual'})...`));

  try {
    // 🧩 Inicializa conexão apenas se necessário
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log(chalk.gray('📡 DataSource inicializado pelo Monthly Quota CRON.'));
    }

    const usersRepository = new UsersRepository();
    const userQuotaService = container.resolve(UserQuotaService);

    const users = await usersRepository.findAllWithSubscriptions();

    let totalUsers = 0;
    let totalQuotaAdded = 0;

    for (const user of users) {
      const tier = (user.subscriptions?.[0]?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
      const quotaAmount = MonthlyQuotaPerTier[tier] || 0;

      if (quotaAmount > 0) {
        // ⚙️ Atualiza a quota do usuário
        await userQuotaService.resetBonus(user.id, quotaAmount);
        totalUsers++;
        totalQuotaAdded += quotaAmount;

        console.log(
          chalk.greenBright(
            `✅ ${quotaAmount} raspagens aplicadas ao usuário ${user.email ?? user.id} (${tier})`
          )
        );
      } else {
        console.log(
          chalk.gray(`- Usuário ${user.email ?? user.id} (${tier}) não possui recarga mensal.`)
        );
      }
    }

    console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(
      chalk.green(
        `🎯 Recarga mensal finalizada — ${totalUsers} usuários atualizados, total de ${totalQuotaAdded} raspagens aplicadas.`
      )
    );
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  } catch (error) {
    console.error(chalk.red('❌ Erro durante recarga de quota mensal:'), error);
  } finally {
    /**
     * 💡 Fecha a conexão apenas se rodar manualmente
     */
    if (!autoMode && dataSource.isInitialized) {
      await dataSource.destroy().catch(() => {});
    }
  }
}

/**
 * 🗓️ Agendamento automático (mensal ou em modo teste)
 * - testMode = true → executa a cada 30s
 * - testMode = false → executa no 1º dia do mês, às 00:00
 */
export function scheduleMonthlyQuota(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 1 * *';
  const modeText = testMode ? chalk.yellow('TEST MODE (30s)') : chalk.blue('MONTHLY QUOTA (dia 1, 00:00)');

  console.log(chalk.cyan(`🚀 Recarga mensal agendada: ${modeText}`));

  cron.schedule(schedule, async () => {
    console.log(chalk.gray('\n🕐 Executando ciclo agendado de recarga mensal...'));
    await runMonthlyQuotaOnce(true); // ✅ autoMode = true → não destrói o DataSource
  });
}

/**
 * 🚀 Execução direta via linha de comando
 * Exemplo:
 *   npx ts-node -r tsconfig-paths/register src/shared/infra/cron/monthlyQuota.cron.ts
 */
if (require.main === module) {
  runMonthlyQuotaOnce(false); // ✅ manual → com destroy no final
}
