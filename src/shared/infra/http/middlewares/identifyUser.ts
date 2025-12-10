// src/shared/infra/http/middlewares/identifyUser.ts

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export default function identifyUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  // ⚙️ Se o usuário já foi autenticado e req.user existe, não faz nada
  if (req.user?.id) {
    return next();
  }

  if (authHeader) {
    const [, token] = authHeader.split(' ');

    try {
      const decoded = verify(
        token,
        authConfig.jwt.secret || '',
      ) as ITokenPayload;

      req.user = {
        ...(req.user || {}),
        id: decoded.sub,
      };
    } catch {
      // Token inválido — apenas ignora e segue sem usuário
    }
  }

  return next();
}
