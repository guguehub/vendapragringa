import AppError from '@shared/errors/AppError';
import { ICalculateShippingDTO } from '../../shipping/dtos/ICalculateShippingDTO';
import { IShippingTypeRepository } from '../../shipping/domain/repositories/IShippingTypeRepository';
import { IShippingZonesRepository } from '../../shipping/domain/repositories/IShippingZonesRepository';
import { IShippingWeightRepository } from '../../shipping/domain/repositories/IShippingWeightRepository';
import { IShippingPriceRepository } from '../../shipping/domain/repositories/IShippingPriceRepository';

class CalculateShippingService {
  constructor(
    private shippingTypeRepository: IShippingTypeRepository,
    private shippingZoneRepository: IShippingZonesRepository,
    private shippingWeightRepository: IShippingWeightRepository,
    private shippingPriceRepository: IShippingPriceRepository
  ) {}

  public async execute({
    shippingType,
    countryCode,
    weightGrams,
  }: ICalculateShippingDTO): Promise<number> {
    // 1. Encontrar o tipo (document ou product)
    const type = await this.shippingTypeRepository.findByCode(shippingType);
    if (!type) {
      throw new AppError('Tipo de frete inválido');
    }

    // 2. Encontrar a zona com base no código do país
    const zone = await this.shippingZoneRepository.findByCountryCode(countryCode);
    if (!zone) {
      throw new AppError('Zona de frete não encontrada para este país');
    }

    // 3. Encontrar a faixa de peso
    const weightKg = weightGrams / 1000; // converter para kg
    const weightRange = await this.shippingWeightRepository.findByWeight(weightKg);
    if (!weightRange) {
      throw new AppError('Faixa de peso não encontrada');
    }

    // 4. Encontrar o preço com base nos IDs
    const price = await this.shippingPriceRepository.findByDetails({
      zoneId: zone.id,
      typeId: type.id,
      weightId: weightRange.id,
    });

    if (!price) {
      throw new AppError('Preço de frete não encontrado');
    }

    return price.price;
  }
}

export default CalculateShippingService;
