import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import { Item } from '@modules/items/entities/Item';

export default async function checkItemActiveStatus(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { itemId } = request.params;

  const itemRepository = getRepository(Item);

  const item = await itemRepository.findOne(itemId);

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  if (!item.isActive) {
    throw new AppError('Item is inactive', 403);
  }

  // Item is active; proceed to the next middleware or route handler
  return next();
}
