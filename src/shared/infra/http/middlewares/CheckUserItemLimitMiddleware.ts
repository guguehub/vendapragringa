import { Request, Response, NextFunction } from 'express';
import { In, IsNull } from 'typeorm';
import AppDataSource from '@shared/infra/typeorm/data-source';
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';
import { Subscription } from '@modules/subscriptions/infra/typeorm/entities/Subscription';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionTierLimits } from '@modules/subscriptions/enums/subscription-limits.enum';

// 🎨 Cores ANSI para logs visuais
const color = {
  green: (msg: string) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string) => `\x1b[33m${msg}\x1b[0m`,
  red: (msg: string) => `\x1b[31m${msg}\x1b[0m`,
  cyan: (msg: string) => `\x1b[36m${msg}\x1b[0m`,
};

export async function CheckUserItemLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const userItemRepo = AppDataSource.getRepository(UserItem);

    // 🔹 1️⃣ Pega tier e limite de cache se disponível
    let tier = req.user?.subscription?.tier as SubscriptionTier | undefined;
let limitFromCache = (req.user as any)?.quota?.item_limit ?? null;

    if (tier && limitFromCache !== null) {
      console.log(color.cyan(`[CheckUserItemLimit] ✅ Cache OK → tier: ${tier}, limite: ${limitFromCache}`));
    }

    // 🔹 2️⃣ Fallback: busca no banco se cache estiver vazio ou incorreto
    if (!tier || limitFromCache === null || limitFromCache === 0) {
      console.log(color.yellow(`[CheckUserItemLimit] ⚠️ Cache incompleto, consultando banco...`));
      const subscriptionRepo = AppDataSource.getRepository(Subscription);
      const subscription = await subscriptionRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      tier = (subscription?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
      limitFromCache = SubscriptionTierLimits[tier] ?? 0;
    }

    const itemLimit = limitFromCache ?? SubscriptionTierLimits[tier] ?? 0;

    // 🔹 3️⃣ Conta itens ativos do usuário
    const userItemsCount = await userItemRepo.count({
      where: [
        { userId, importStage: In(['ready', 'listed', 'sold']), syncStatus: 'active' },
        { userId, importStage: In(['ready', 'listed', 'sold']), syncStatus: IsNull() },
      ],
    });

    console.log(color.green(`[CheckUserItemLimit] 👤 user:${userId} | plano:${tier} | ativos:${userItemsCount}/${itemLimit}`));

    // 🔹 4️⃣ Bloqueia se o limite for atingido
    if (userItemsCount >= itemLimit && tier !== SubscriptionTier.INFINITY) {
      console.warn(color.red(`[CheckUserItemLimit] ❌ Limite atingido → ${itemLimit} itens no plano ${tier}`));
      return res.status(403).json({
        message: `Limite de itens atingido no seu plano (${tier}). Exclua um item ou faça upgrade.`,
      });
    }

    return next();
  } catch (err) {
    console.error('[CheckUserItemLimitMiddleware] ❌ Erro ao verificar limite:', err);
    return res.status(500).json({
      message: 'Erro interno ao verificar limite de itens.',
    });
  }
}
