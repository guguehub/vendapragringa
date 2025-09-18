// src/shared/infra/http/middlewares/isAdmin.ts
import { Request, Response, NextFunction } from 'express';

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  // 🔍 Log completo do usuário para depuração
  console.log('🔍 [isAdmin] REQ USER:', user);

  if (!user) {
    console.warn('⚠️ [isAdmin] Usuário não identificado no request.');
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  if (!user.is_admin) {
    console.warn('⛔ [isAdmin] Acesso negado: usuário não é admin.');
    return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
  }

  console.log('✅ [isAdmin] Acesso permitido para admin:', user.id);
  return next();
}
