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

  if (authHeader) {
    const [, token] = authHeader.split(' ');

    try {
      const decoded = verify(
        token,
        authConfig.jwt.secret || '',
      ) as ITokenPayload;

      req.user = {
        id: decoded.sub,
      };
    } catch {
      // Invalid token; proceed without attaching user info
    }
  }

  return next();
}
