import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingPrice from '../entities/ShippingPrice';
import { IShippingPriceRepository } from '@modules/shipping/domain/repositories/IShippingPriceRepository';

export class ShippingPricesRepository implements IShippingPriceRepository {
  private ormRepo: Repository<ShippingPrice>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingPrice);
  }

  async findByDetails({ typeId, zoneId, weightId }: {
    typeId: string;
    zoneId: string;
    weightId: string;
  }) {
    return this.ormRepo.findOneBy({
      shipping_type_id: typeId,
      shipping_zone_id: zoneId,
      shipping_weight_id: weightId,
    });
  }
  async findAll() {
    return this.ormRepo.find();
  }
}
