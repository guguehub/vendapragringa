import { Request, Response, NextFunction } from 'express';

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user?.is_admin) {
    return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
  }
  return next();
}
