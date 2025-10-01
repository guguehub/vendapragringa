import { Request, Response, NextFunction } from 'express';
import AppDataSource from '@shared/infra/typeorm/data-source';
import UserItem from '@modules/user_items/infra/typeorm/entities/UserItems';
import { Subscription } from '@modules/subscriptions/infra/typeorm/entities/Subscription';
import { In, IsNull } from 'typeorm';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionTierLimits } from '@modules/subscriptions/enums/subscription-limits.enum';

// Estágios considerados como itens ativos
const activeImportStages = ['ready', 'listed', 'sold'] as const;
type ActiveImportStage = typeof activeImportStages[number];

// Versão mutável para uso no TypeORM
const mutableStages: ActiveImportStage[] = [...activeImportStages];

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
    const userItemRepository = AppDataSource.getRepository(UserItem);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscription = await subscriptionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    const tier = (subscription?.tier as SubscriptionTier) ?? SubscriptionTier.FREE;
    const limit = SubscriptionTierLimits[tier];

    // Conta itens ativos (import_stage válido + sync_status ativo ou null)
    const userItemsCount = await userItemRepository.count({
  where: [
    { userId, importStage: In(mutableStages), syncStatus: 'active' },
    { userId, importStage: In(mutableStages), syncStatus: IsNull() },
  ],
});

    if (userItemsCount >= limit) {
      console.warn(
        `Usuário ${userId} atingiu o limite de ${limit} itens para o plano ${tier}`,
      );
      return res.status(403).json({
        message: `Limite de itens atingido no seu plano (${tier}). Exclua um item ou faça upgrade.`,
      });
    }

    return next();
  } catch (err) {
    console.error('Erro ao verificar limite de itens:', err);
    return res.status(500).json({
      message: 'Erro interno ao verificar limite de itens.',
    });
  }
}
