import { ICreateShippingPriceDTO } from '../dtos/ICreateShippingPriceDTO';
import { IShippingPriceRepository } from '../domain/repositories/IShippingPriceRepository';
import AppError from '../../../shared/errors/AppError'

class CreateShippingPriceService {
  constructor(private shippingPriceRepository: IShippingPriceRepository) {}

  public async execute(data: ICreateShippingPriceDTO) {
    const existing = await this.shippingPriceRepository.findByDetails({
      zoneId: data.zone_id,
      weightId: data.weight_id,
      typeId: data.type_id,
    });

    if (existing) {
      throw new AppError('Já existe um frete para essa combinação');
    }

    const shippingPrice = await this.shippingPriceRepository.create(data);
    return shippingPrice;
  }
}

export default CreateShippingPriceService;
