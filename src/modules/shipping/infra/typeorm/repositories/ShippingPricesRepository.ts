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
  }): Promise<ShippingPrice | null> {
    return this.ormRepo.findOneBy({
      shipping_type_id: typeId,
      shipping_zone_id: zoneId,
      shipping_weight_id: weightId,
    });
  }
  async findById(id: string): Promise<ShippingPrice | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async save(price: ShippingPrice): Promise<ShippingPrice | undefined> {
    return this.ormRepo.save(price);
  }

  async create(price: ShippingPrice): Promise<void> {
    await this.ormRepo.save(price);
  }

  async remove(price: ShippingPrice): Promise<void> {
    await this.ormRepo.remove(price);
  }
  async findAll(): Promise<ShippingPrice[]> {
    return this.ormRepo.find();
  }
}
