import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingPrice from '../entities/ShippingPrice';
import { IShippingPriceRepository } from '@modules/shipping/domain/repositories/IShippingPriceRepository';
import { ICreateShippingPriceDTO } from '@modules/shipping/dtos/ICreateShippingPriceDTO';

export class ShippingPricesRepository implements IShippingPriceRepository {
  private ormRepository: Repository<ShippingPrice>;

  constructor() {
    this.ormRepository = dataSource.getRepository(ShippingPrice);
  }

  async findAll(): Promise<ShippingPrice[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<ShippingPrice | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findByDetails({
    typeId,
    zoneId,
    weightId,
  }: {
    typeId: string;
    zoneId: string;
    weightId: string;
  }): Promise<ShippingPrice | null> {
    return this.ormRepository.findOneBy({
      shipping_type_id: typeId,
      shipping_zone_id: zoneId,
      shipping_weight_id: weightId,
    });
  }

  async create(data: ICreateShippingPriceDTO): Promise<ShippingPrice> {
    const shippingPrice = this.ormRepository.create(data);
    await this.ormRepository.save(shippingPrice);
    return shippingPrice;
  }

  async createMany(data: ICreateShippingPriceDTO[]): Promise<ShippingPrice[]> {
    const entries = this.ormRepository.create(data);
    return this.ormRepository.save(entries);
  }

  async save(price: ShippingPrice): Promise<ShippingPrice> {
    return this.ormRepository.save(price);
  }

  async remove(price: ShippingPrice): Promise<void> {
    await this.ormRepository.remove(price);
  }
}
