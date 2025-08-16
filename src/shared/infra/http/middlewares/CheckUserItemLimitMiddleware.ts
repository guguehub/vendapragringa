import { Request, Response, NextFunction } from "express";
import AppDataSource from "@shared/infra/typeorm/data-source";
import Item from "@modules/item/infra/typeorm/entities/Item";
import { Subscription } from "@modules/subscriptions/infra/typeorm/entities/Subscription";

const tierLimits: Record<string, number> = {
  free: 4,
  bronze: 20,
  silver: 50,
  gold: 150,
};

export async function CheckUserItemLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const userId = req.user?.id; // precisa do identifyUser + isAuthenticated antes

  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  try {
    const itemRepository = AppDataSource.getRepository(Item);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscription = await subscriptionRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    const tier = subscription?.tier ?? "free";
    const limit = tierLimits[tier] ?? tierLimits.free;

    const userItemsCount = await itemRepository.count({
      where: { user: { id: userId } },
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
