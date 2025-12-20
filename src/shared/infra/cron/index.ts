require('tsconfig-paths/register');
import { scheduleMonthlyQuota } from './monthlyQuota.cron';
import { runDailyBonusOnce, scheduleDailyBonus } from './dailyBonus.cron';

/**
 * 🧭 ATIVAÇÃO DOS CRON JOBS DO SISTEMA
 * ------------------------------------
 * Aqui você controla a execução dos crons principais:
 *
 * 💰 1. Recarga mensal de raspagens → scheduleMonthlyQuota()
 * 🎁 2. Bônus diário de raspagens → runDailyBonusOnce() ou scheduleDailyBonus()
 *
 * 🧪 MODOS DE EXECUÇÃO:
 * - true  → modo teste (executa a cada 30s)
 * - false → modo normal (00:00 para o diário, 1x/mês para o mensal)
 * - sem parâmetros → executa apenas uma vez (manual)
 *
 * EXEMPLOS:
 * -----------
 * ✅ Rodar uma vez manualmente (sem agendamento):
 *     runDailyBonusOnce();
 *
 * ✅ Rodar a cada 30s para testar:
 *     scheduleDailyBonus(true);
 *
 * ✅ Rodar todo dia à meia-noite:
 *     scheduleDailyBonus(false);
 *
 * ✅ Rodar recarga mensal normalmente:
 *     scheduleMonthlyQuota(false);
 */

/**
 * 💰 CRON MENSAL — recarga de raspagens mensais
 * ---------------------------------------------
 * Recria o saldo total de acordo com o tier do usuário
 */
scheduleMonthlyQuota(false);

/**
 * 🎁 CRON DIÁRIO — bônus diário de raspagens
 * ------------------------------------------
 * Use conforme a necessidade:
 *
 * - `runDailyBonusOnce()`     → executa 1x agora (modo manual)
 * - `scheduleDailyBonus(true)`  → executa a cada 30s (modo teste)
 * - `scheduleDailyBonus(false)` → executa todo dia às 00:00
 */

// 👉 Aqui estamos executando manualmente (1x)
runDailyBonusOnce();

// 💡 Para ativar agendamento automático, comente a linha acima e descomente uma das seguintes:
// scheduleDailyBonus(true);  // modo teste — roda a cada 30s
// scheduleDailyBonus(false); // modo normal — roda todo dia às 00:00
