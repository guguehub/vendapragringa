import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShippingTypesRepository } from '../../typeorm/repositories/ShippingTypesRepository';

export class ShippingTypesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const repo = container.resolve(ShippingTypesRepository);
    const types = await repo.findAll?.();
    return res.json(types);
  }
}
