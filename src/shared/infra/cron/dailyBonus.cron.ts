import { container } from "tsyringe";
import cron from "node-cron";
import chalk from "chalk";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import ResetDailyBonusService from "@modules/user_quota/services/ResetDailyBonusService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";

/**
 * Configuração de bônus diário por plano
 */
const DailyBonusPerTier: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 5,
  [SubscriptionTier.BRONZE]: 10,
  [SubscriptionTier.SILVER]: 20,
  [SubscriptionTier.GOLD]: 50,
  [SubscriptionTier.INFINITY]: 100,
};

/**
 * Inicializa a tarefa cron para aplicar o bônus diário
 */
export function scheduleDailyBonus() {
  // Roda todos os dias às 00:00 (meia-noite)
  cron.schedule("0 0 * * *", async () => {
    console.log(chalk.blue("⏰ Iniciando aplicação de Daily Bonus..."));

    const usersRepository = new UsersRepository();
    const resetDailyBonusService = container.resolve(ResetDailyBonusService);

    try {
      // Buscar todos os usuários
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
          console.log(
            chalk.gray(`- Usuário ${user.id} (${tier}) não possui bônus definido.`)
          );
        }
      }

      console.log(chalk.green("🎯 Daily Bonus aplicado para todos os usuários com sucesso!"));
    } catch (error) {
      console.error(chalk.red("❌ Erro ao aplicar Daily Bonus:"), error);
    }
  });
}
