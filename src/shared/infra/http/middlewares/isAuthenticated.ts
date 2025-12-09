// src/shared/infra/http/middlewares/isAuthenticated.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import User from '@modules/users/infra/typeorm/entities/User';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';
import dataSource from '@shared/infra/typeorm/data-source';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  is_admin?: boolean;
}

interface ICachedUser {
  id: string;
  is_admin?: boolean;
  quota?: {
    scrape_balance: number;
    total_scrapes_used: number;
  };
}

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;
    console.log('🔑 TOKEN DECODIFICADO:', decoded);

    const cacheKey = `user:${decoded.sub}`;
    let cachedUser = await RedisCache.recover<ICachedUser>(cacheKey);

    if (!cachedUser) {
      console.log('[CACHE MISS] Buscando usuário no banco:', decoded.sub);

      const userRepo = dataSource.getRepository(User);
      const quotaRepo = dataSource.getRepository(UserQuota);

      const user = await userRepo.findOne({ where: { id: decoded.sub } });
      if (!user) throw new AppError('User not found', 404);

      const quota = await quotaRepo.findOne({ where: { user_id: user.id } });

      cachedUser = {
        id: user.id,
        is_admin: user.is_admin,
        quota: {
          scrape_balance: quota?.scrape_balance ?? 0,
          total_scrapes_used: quota?.scrape_count ?? 0,
        },
      };

      await RedisCache.save(cacheKey, cachedUser, 300);
      console.log('[CACHE SET] user:', cachedUser.id);
    } else {
      console.log('[CACHE HIT] user:', cachedUser.id);
    }

    req.user = {
  ...cachedUser,
  subscription: (cachedUser as any).subscription ?? undefined,
    };

    console.log('REQ USER (após autenticação):', req.user);
    return next();
  } catch (err) {
    console.error('❌ Erro ao validar token:', err);
    throw new AppError('Invalid JWT token', 401);
  }
}
