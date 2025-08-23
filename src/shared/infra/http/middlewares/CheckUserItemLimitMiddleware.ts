import { Request, Response, NextFunction } from "express";
import AppDataSource from "@shared/infra/typeorm/data-source";
import UserItem from "@modules/user_items/infra/typeorm/entities/UserItems";
import { Subscription } from "@modules/subscriptions/infra/typeorm/entities/Subscription";
import { In, IsNull } from "typeorm";

const tierLimits: Record<string, number> = {
  free: 4,
  bronze: 20,
  silver: 50,
  gold: 150,
};

// Está assumindo que import_stage ativo = 'ready', 'listed', 'sold'
const activeImportStages: ( 'ready' | 'listed' | 'sold')[] = [
  "ready",
  "listed",
  "sold",
];

export async function CheckUserItemLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const userItemRepository = AppDataSource.getRepository(UserItem);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscription = await subscriptionRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    const tier = subscription?.tier ?? "free";
    const limit = tierLimits[tier] ?? tierLimits.free;

    // Conta itens do usuário que estão em import_stage ativo e sync_status 'active' ou null
    const userItemsCount = await userItemRepository.count({
      where: [
        { userId, import_stage: In(activeImportStages), sync_status: "active" },
        { userId, import_stage: In(activeImportStages), sync_status: IsNull() },
      ],
    });

    if (userItemsCount >= limit) {
      console.warn(
        `Usuário ${userId} atingiu o limite de ${limit} itens para o plano ${tier}`
      );
      return res.status(403).json({
        message: `Limite de itens atingido no seu plano (${tier}). Exclua um item ou faça upgrade.`,
      });
    }

    return next();
  } catch (err) {
    console.error("Erro ao verificar limite de itens:", err);
    return res.status(500).json({
      message: "Erro interno ao verificar limite de itens.",
    });
  }
}
