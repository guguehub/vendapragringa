import { injectable, inject } from "tsyringe";
import IUserQuotaRepository from "../domain/repositories/IUserQuotaRepository";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache";

// 🎨 Logs coloridos para facilitar visualização
const color = {
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
  cyan: (msg: string) => `\x1b[36m${msg}\x1b[0m`,
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
};

@injectable()
export default class ResetDailyBonusService {
  constructor(
    @inject("UserQuotasRepository")
    private userQuotaRepository: IUserQuotaRepository
  ) {}

  /**
   * 🎁 Aplica o Daily Bonus:
   * 1️⃣ Soma o daily_bonus_count e o bônus do plano ao saldo total (scrape_balance)
   * 2️⃣ Zera o daily_bonus_count
   * 3️⃣ Reseta o contador diário (scrape_count)
   * 4️⃣ Atualiza o cache do usuário
   */
  public async execute(user_id: string, bonusAmount: number): Promise<void> {
    const quota = await this.userQuotaRepository.findByUserId(user_id);
    if (!quota) {
      throw new AppError(`UserQuota não encontrada para o usuário ${user_id}.`);
    }

    const saldoAntes = quota.scrape_balance;
    const dailyAntes = quota.daily_bonus_count;
    const usadosAntes = quota.scrape_count;

    // 🔹 Soma bônus atual + adicional
    const totalBonus = (quota.daily_bonus_count || 0) + bonusAmount;
    quota.scrape_balance = (quota.scrape_balance || 0) + totalBonus;

    // 🔹 Zera o contador de bônus e de raspagens diárias
    quota.daily_bonus_count = 0;
    quota.scrape_count = 0;

    // 💾 Salva alterações no banco
    await this.userQuotaRepository.save(quota);

    // 🔁 Atualiza cache relacionado ao usuário e assinatura
    await RedisCache.invalidate(`user:${user_id}`);
    await RedisCache.invalidate(`user-subscription-${user_id}`);

    // 📊 Log visual
    console.log(color.cyan(`\n[ResetDailyBonusService] 🎁 Bônus diário aplicado!`));
    console.table({
      user_id,
      saldo_antes: saldoAntes,
      bonus_antes: dailyAntes,
      usados_antes: usadosAntes,
      bonus_adicionado: bonusAmount,
      saldo_atual: quota.scrape_balance,
    });

    console.log(color.green(`[ResetDailyBonusService] ✅ Cache limpo e quota atualizada.\n`));
  }
}
