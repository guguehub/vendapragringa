import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CalculateShippingService from '@modules/shipping/services/CalculateShippingService';

export class CalculateShippingController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { weightGrams, shippingType, countryCode } = req.body;

    const calculateShipping = container.resolve(CalculateShippingService);

    const price = await calculateShipping.execute({
      weightGrams,
      shippingType,
      countryCode,
    });

    return res.json({ price });
  }
}
