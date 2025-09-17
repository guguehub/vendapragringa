// src/shared/infra/http/middlewares/isAuthenticated.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  is_admin?: boolean; // adicionamos opcional para inspecionar
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload | any;

    // 🔍 Log para inspecionar o conteúdo do token
    console.log('🔑 TOKEN DECODIFICADO:', decoded);

    // Agora garantimos que request.user sempre existirá após este middleware
    request.user = {
      id: decoded.sub,
      is_admin: decoded.is_admin, // se existir, repassamos
    };

    return next();
  } catch (err) {
    console.error('❌ Erro ao validar token:', err);
    throw new AppError('Invalid JWT token', 401);
  }
}
