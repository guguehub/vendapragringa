import { Request, Response, NextFunction } from "express";
import AppDataSource from "@shared/infra/typeorm/data-source";
//import { UserItem } from "@modules/user_items/infra/typeorm/entities/UserItem";
import { Subscription } from "@modules/subscriptions/infra/typeorm/entities/Subscription";

const tierLimits = {
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
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const userItemsRepository = AppDataSource.getRepository(UserItem);
  const subscriptionRepository = AppDataSource.getRepository(Subscription);

  const subscription = await subscriptionRepository.findOne({
    where: { user: { id: userId } },
    relations: ["user"],
  });

  const tier = subscription?.tier ?? "free";
  const limit = tierLimits[tier];

  const savedCount = await userItemsRepository.count({
    where: { user: { id: userId } },
  });

  if (savedCount >= limit) {
    console.log(
      `[LIMIT REACHED] Usuário ${userId} atingiu limite de itens salvos (${savedCount}/${limit}). Delete algum item para continuar raspando.`
    );

    return res.status(403).json({
      error: "Limite de itens salvos atingido. Delete algum item para continuar raspando.",
    });
  }

  return next();
}
