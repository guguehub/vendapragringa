// src/modules/subscriptions/infra/http/controllers/CheckSubscriptionStatusController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CheckSubscriptionStatusService from '@modules/subscriptions/services/CheckSubscriptionStatusService';
import UserQuotaRepository from '@modules/user_quota/infra/typeorm/repositories/UserQuotaRepository';
import RedisCache from '@shared/cache/RedisCache';
import { SubscriptionTierScrapeLimits } from '@modules/subscriptions/enums/subscription-tier-scrape-limits.enum';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

export default class CheckSubscriptionStatusController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    if (!userId) throw new AppError('User not authenticated', 401);

    const checkSubscriptionStatusService = container.resolve(CheckSubscriptionStatusService);
    const userQuotaRepository = new UserQuotaRepository();

    // 🧩 1️⃣ Garante dados frescos (limpa cache)
    await RedisCache.invalidate(`user-subscription-${userId}`);
    await RedisCache.invalidate(`user:${userId}`);

    // 🧠 2️⃣ Reexecuta serviço de status
    const subscriptionStatus = await checkSubscriptionStatusService.execute(userId);

    // 💾 3️⃣ Busca quota real do banco
    const quota = await userQuotaRepository.findByUserId(userId);

    // 📊 4️⃣ Cálculos consolidados
    const saldo_diario = quota
      ? (quota.scrape_balance || 0) + (quota.daily_bonus_count || 0)
      : 0;

    const limite_mensal =
      SubscriptionTierScrapeLimits[subscriptionStatus.tier as SubscriptionTier] || 0;

    // 🎁 5️⃣ Define bônus futuro com base no plano
    const DailyBonusPerTier: Record<SubscriptionTier, number> = {
      [SubscriptionTier.FREE]: 3,
      [SubscriptionTier.BRONZE]: 0,
      [SubscriptionTier.SILVER]: 5,
      [SubscriptionTier.GOLD]: 8,
      [SubscriptionTier.INFINITY]: 9999,
    };

    const proximo_bonus_quantidade =
      DailyBonusPerTier[subscriptionStatus.tier as SubscriptionTier] || 0;

    // ⏰ 6️⃣ Próximo bônus diário (meia-noite local)
    const now = new Date();
    const next_bonus_at = new Date(now);
    next_bonus_at.setHours(24, 0, 0, 0);

    const next_bonus_local = next_bonus_at.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour12: false,
    });

    // 🧾 7️⃣ Mensagem explicativa com formatação clara
    const mensagem_formatada = `💰 Você tem ${saldo_diario} raspagens disponíveis hoje (de um total de ${limite_mensal} do seu plano ${subscriptionStatus.tier.toUpperCase()}). Próximo bônus de +${proximo_bonus_quantidade} raspagens em ${next_bonus_local}.`;

    // 🎯 8️⃣ Monta resposta final
    const result = {
      ...subscriptionStatus,
      quota: quota
        ? {
            scrape_balance: quota.scrape_balance,
            scrape_count: quota.scrape_count,
            daily_bonus_count: quota.daily_bonus_count,
            saved_items_limit: quota.saved_items_limit,
            scrape_logs_limit: quota.scrape_logs_limit,
            item_limit: quota.item_limit,
          }
        : null,
      resumo: {
        saldo_diario,
        limite_mensal,
        proximo_bonus_quantidade,
        next_bonus_at,
        mensagem_formatada,
      },
    };

    console.log(
      `[CheckSubscriptionStatusController] ✅ user:${userId} | plano:${result.tier} | saldo:${saldo_diario}/${limite_mensal} | next_bonus:+${proximo_bonus_quantidade} @${next_bonus_at.toISOString()}`,
    );

    return response.status(200).json(result);
  }
}
