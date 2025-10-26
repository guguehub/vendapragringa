import { injectable, inject } from "tsyringe";
import IUserQuotaRepository from "../domain/repositories/IUserQuotaRepository";
import AppError from "@shared/errors/AppError";

@injectable()
export default class ResetDailyBonusService {
  constructor(
    @inject("UserQuotasRepository")
    private userQuotaRepository: IUserQuotaRepository
  ) {}

  /**
   * Aplica o daily bonus:
   * 1️⃣ Soma o daily_bonus_count ao scrape_balance.
   * 2️⃣ Zera o daily_bonus_count.
   * 3️⃣ Adiciona o valor enviado via parâmetro caso exista (ex: bônus por plano).
   */
  public async execute(user_id: string, bonusAmount: number): Promise<void> {
    const userQuota = await this.userQuotaRepository.findByUserId(user_id);

    if (!userQuota) {
      throw new AppError(`UserQuota não encontrada para o usuário ${user_id}.`);
    }

    // Soma o daily_bonus_count atual + novo bônus ao saldo principal
    const totalBonus = (userQuota.daily_bonus_count || 0) + bonusAmount;
    userQuota.scrape_balance = (userQuota.scrape_balance || 0) + totalBonus;

    // Zera o daily_bonus_count
    userQuota.daily_bonus_count = 0;

    // Salva as alterações
    await this.userQuotaRepository.save(userQuota);
  }
}
