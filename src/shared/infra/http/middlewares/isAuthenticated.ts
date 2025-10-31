import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';
import User from '@modules/users/infra/typeorm/entities/User';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';
import dataSource from '@shared/infra/typeorm/data-source';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  is_admin?: boolean;
}

interface ICachedSubscription {
  id: string;
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  start_date: string | null;
  expires_at: string | null;
  isTrial: boolean;
  cancelled_at: string | null;
  userId: string;
  created_at: string;
  updated_at: string;
  scrape_balance: number;
  total_scrapes_used: number;
}

interface ICachedUser {
  id: string;
  is_admin?: boolean;
  subscription?: ICachedSubscription | null;
}

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;
    console.log('🔑 TOKEN DECODIFICADO:', decoded);

    const cacheKey = `user:${decoded.sub}`;
    let cachedUser = await RedisCache.recover<ICachedUser>(cacheKey);

    if (!cachedUser) {
      console.log('[CACHE MISS] Buscando usuário e quotas no banco:', decoded.sub);

      const userRepo = dataSource.getRepository(User);
      const quotaRepo = dataSource.getRepository(UserQuota);

      const user = await userRepo.findOne({
        where: { id: decoded.sub },
        relations: ['subscriptions'],
      });

      if (!user) throw new AppError('User not found', 404);

      const activeSub = user.subscriptions?.find(s => s.status === 'active');

      // 🔹 Busca a quota associada ao usuário
      const quota = await quotaRepo.findOne({
        where: { user_id: user.id },
      });

      cachedUser = {
        id: user.id,
        is_admin: user.is_admin,
        subscription: activeSub
          ? {
              id: activeSub.id,
              status: activeSub.status as SubscriptionStatus,
              tier: activeSub.tier as SubscriptionTier,
              start_date: activeSub.start_date?.toISOString() || null,
              expires_at: activeSub.expires_at?.toISOString() || null,
              isTrial: activeSub.isTrial,
              cancelled_at: activeSub.cancelled_at?.toISOString() || null,
              userId: activeSub.userId,
              created_at: activeSub.created_at.toISOString(),
              updated_at: activeSub.updated_at.toISOString(),
              scrape_balance: quota?.scrape_balance ?? 0,
              total_scrapes_used: quota?.scrape_count ?? 0,
            }
          : null,
      };

      // Salva no Redis por 5 minutos
      await RedisCache.save(cacheKey, cachedUser, 300);
      console.log('[CACHE SET] user:', cachedUser.id);
    } else {
      console.log('[CACHE HIT] user:', cachedUser.id);
    }

    req.user = cachedUser;
    console.log('REQ USER:', req.user);

    return next();
  } catch (err) {
    console.error('❌ Erro ao validar token:', err);
    throw new AppError('Invalid JWT token', 401);
  }
}
