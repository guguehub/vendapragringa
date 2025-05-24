import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateShippingPriceService from '../../../services/UpdateShippingPriceService';
import DeleteShippingPriceService from '../../../services/DeleteShippingPriceService';

export default class ShippingPricesController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { price } = request.body;

    const updateShippingPrice = container.resolve(UpdateShippingPriceService);

    const updated = await updateShippingPrice.execute({
      id,
      price,
    });

    return response.json(updated);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteShippingPrice = container.resolve(DeleteShippingPriceService);

    await deleteShippingPrice.execute(id);

    return response.status(204).send();
  }
}
