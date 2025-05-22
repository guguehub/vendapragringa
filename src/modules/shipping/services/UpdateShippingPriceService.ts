import { IShippingPriceRepository } from '../repositories/IShippingPriceRepository';
import AppError from '@shared/errors/AppError';
import { IUpdateShippingPriceDTO } from '../dtos/IUpdateShippingPriceDTO';

class UpdateShippingPriceService {
  constructor(private shippingPriceRepository: IShippingPriceRepository) {}

  public async execute({ id, price }: IUpdateShippingPriceDTO) {
    const shippingPrice = await this.shippingPriceRepository.findById(id);

    if (!shippingPrice) {
      throw new AppError('Preço de frete não encontrado');
    }

    shippingPrice.price = price;

    return await this.shippingPriceRepository.save(shippingPrice);
  }
}

export default UpdateShippingPriceService;
