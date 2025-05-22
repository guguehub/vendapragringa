import { IShippingPriceRepository } from '../repositories/IShippingPriceRepository';
import AppError from '@shared/errors/AppError';

class DeleteShippingPriceService {
  constructor(private shippingPriceRepository: IShippingPriceRepository) {}

  public async execute(id: string): Promise<void> {
    const shippingPrice = await this.shippingPriceRepository.findById(id);

    if (!shippingPrice) {
      throw new AppError('Preço de frete não encontrado');
    }

    await this.shippingPriceRepository.remove(shippingPrice);
  }
}

export default DeleteShippingPriceService;
