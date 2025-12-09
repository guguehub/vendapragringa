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
  [SubscriptionTier.INFINITY]: 9999, // prático para teste
};

/**
 * 📅 Agendador principal
 *
 * @param testMode Define se roda em modo de teste (a cada 30s)
 */
export function scheduleMonthlyQuota(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 1 * *';
  const modeText = testMode ? chalk.yellow('TEST MODE (30s)') : chalk.blue('MONTHLY RECHARGE');

  cron.schedule(schedule, async () => {
    console.log(chalk.cyan(`\n⏰ Iniciando recarga de quota mensal... [${modeText}]`));

    const usersRepository = new UsersRepository();
    const userQuotaService = container.resolve(UserQuotaService);

    try {
      const users = await usersRepository.findAll();

      for (const user of users) {
        const tier = user.subscription?.tier ?? SubscriptionTier.FREE;
        const quotaAmount = MonthlyQuotaPerTier[tier] || 0;

        if (quotaAmount > 0) {
          await userQuotaService.resetBonus(user.id, quotaAmount);

          console.log(
            chalk.green(
              `✅ Recarga de ${quotaAmount} raspagens aplicada ao usuário ${user.id} (${tier})`
            )
          );
        } else {
          console.log(
            chalk.gray(`- Usuário ${user.id} (${tier}) não possui recarga definida.`)
          );
        }
      }

      console.log(chalk.green('\n🎯 Recarga mensal finalizada com sucesso!'));
    } catch (error) {
      console.error(chalk.red('❌ Erro durante recarga de quota mensal:'), error);
    }
  });
}
