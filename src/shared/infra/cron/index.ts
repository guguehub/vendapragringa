// src/shared/infra/cron/index.ts
import { scheduleMonthlyQuota } from './monthlyQuota.cron';
import { scheduleDailyBonus } from './dailyBonus.cron';

/**
 * 🧭 Ativação dos CRON JOBS do sistema
 *
 * Modo TESTE → true
 * Modo NORMAL → false
 */

// 💰 Cron mensal (recarga de raspagens)
scheduleMonthlyQuota(false);

// 🎁 Cron diário (bônus diário de raspagens)
scheduleDailyBonus(false);
