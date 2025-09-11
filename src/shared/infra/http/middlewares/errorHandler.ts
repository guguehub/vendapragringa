import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);

  return res.status(500).json({ error: 'Internal server error' });
}
