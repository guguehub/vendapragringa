import 'reflect-metadata';
import '@shared/container';
import dataSource from '@shared/infra/typeorm/data-source';
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
  [SubscriptionTier.FREE]: 2,
  [SubscriptionTier.BRONZE]: 3,
  [SubscriptionTier.SILVER]: 5,
  [SubscriptionTier.GOLD]: 10,
  [SubscriptionTier.INFINITY]: 9999, // prático para testes
};

/**
 * 🕒 Agenda o bônus diário.
 *
 * Modo normal → executa todo dia à 00:00
 * Modo teste → executa a cada 30 segundos
 */
export function scheduleDailyBonus(testMode = false) {
  const schedule = testMode ? '*/30 * * * * *' : '0 0 * * *';
  const modeText = testMode ? chalk.yellow('TEST MODE (30s)') : chalk.blue('DAILY BONUS (00:00)');

  cron.schedule(schedule, async () => {
    console.log(chalk.cyan(`\n⏰ Iniciando aplicação de Daily Bonus... [${modeText}]`));

    try {
      // 🧩 Garante que o DataSource do TypeORM esteja inicializado
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        console.log(chalk.gray('📡 DataSource inicializado pelo Daily Bonus CRON.'));
      }

      const usersRepository = new UsersRepository();
      const resetDailyBonusService = container.resolve(ResetDailyBonusService);
      const users = await usersRepository.findAll();

      for (const user of users) {
        const tier = user.subscription?.tier ?? SubscriptionTier.FREE;
        const bonusAmount = DailyBonusPerTier[tier] || 0;

        if (bonusAmount > 0) {
          await resetDailyBonusService.execute(user.id, bonusAmount);
          console.log(
            chalk.green(
              `✅ Daily Bonus de ${bonusAmount} raspagens aplicado para usuário ${user.email ?? user.id} (${tier})`
            )
          );
        } else {
          console.log(
            chalk.gray(`- Usuário ${user.email ?? user.id} (${tier}) não possui bônus definido.`)
          );
        }
      }

      console.log(chalk.green('\n🎯 Daily Bonus aplicado para todos os usuários com sucesso!'));
    } catch (error) {
      console.error(chalk.red('❌ Erro ao aplicar Daily Bonus:'), error);
    }
  });
}
