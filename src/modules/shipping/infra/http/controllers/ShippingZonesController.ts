import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShippingZonesRepository } from '../../typeorm/repositories/ShippingZonesRepository';

export class ShippingZonesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const repo = container.resolve(ShippingZonesRepository);
    const zones = await repo.findAll();
    return res.json(zones);
  }
}
