import 'reflect-metadata';
import '@shared/container';
import { container } from 'tsyringe';
import cron from 'node-cron';
import chalk from 'chalk';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import ResetDailyBonusService from '@modules/user_quota/services/ResetDailyBonusService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

/**
 * 🎁 Configuração de bônus diário por plano
 */
const DailyBonusPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 5,
  [SubscriptionTier.BRONZE]: 10,
  [SubscriptionTier.SILVER]: 20,
  [SubscriptionTier.GOLD]: 50,
  [SubscriptionTier.INFINITY]: 100,
};

/**
 * 🕒 Agenda o bônus diário.
 *
 * Modo normal → executa todo dia à 00:00
 * Modo teste → executa a cada 30 segundos
 */
export function scheduleDailyBonus(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 * * *';
  const modeText = testMode ? 'TEST MODE (30s)' : 'DAILY BONUS';

  cron.schedule(schedule, async () => {
    console.log(chalk.blue(`⏰ Iniciando aplicação de Daily Bonus... [${modeText}]`));

    const usersRepository = new UsersRepository();
    const resetDailyBonusService = container.resolve(ResetDailyBonusService);

    try {
      const users = await usersRepository.findAll();

      for (const user of users) {
        const tier = user.subscription?.tier ?? SubscriptionTier.FREE;
        const bonusAmount = DailyBonusPerTier[tier] || 0;

        if (bonusAmount > 0) {
          await resetDailyBonusService.execute(user.id, bonusAmount);
          console.log(
            chalk.green(
              `✅ Daily Bonus de ${bonusAmount} aplicado para usuário ${user.id} (${tier})`
            )
          );
        } else {
          console.log(chalk.gray(`- Usuário ${user.id} (${tier}) não possui bônus definido.`));
        }
      }

      console.log(chalk.green('🎯 Daily Bonus aplicado para todos os usuários com sucesso!'));
    } catch (error) {
      console.error(chalk.red('❌ Erro ao aplicar Daily Bonus:'), error);
    }
  });
}
