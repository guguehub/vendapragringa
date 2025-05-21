import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShippingWeightsRepository } from '../../typeorm/repositories/ShippingWeightsRepository';

export class ShippingWeightsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const repo = container.resolve(ShippingWeightsRepository);
    const all = await repo.findAll?.();
    return res.json(all);
  }
}
