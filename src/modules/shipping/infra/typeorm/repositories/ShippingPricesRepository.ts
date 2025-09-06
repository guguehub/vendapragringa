import { DataSource, Repository } from 'typeorm';
import ShippingPrice from '../entities/ShippingPrice';
import { IShippingPriceRepository } from '../../../../../modules/shipping/domain/repositories/IShippingPriceRepository';
import { ICreateShippingPriceDTO } from '../../../../../modules/shipping/dtos/ICreateShippingPriceDTO';

export class ShippingPricesRepository implements IShippingPriceRepository {
  private ormRepository: Repository<ShippingPrice>;

  constructor(private dataSource: DataSource) {
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
    const shippingPrice = this.ormRepository.create({
      shipping_type_id: data.type_id,
      shipping_zone_id: data.zone_id,
      shipping_weight_id: data.weight_id,
      price: data.price,
    });
    return this.ormRepository.save(shippingPrice);
  }

  async createMany(data: ICreateShippingPriceDTO[]): Promise<ShippingPrice[]> {
    const entries = data.map(dto =>
      this.ormRepository.create({
        shipping_type_id: dto.type_id,
        shipping_zone_id: dto.zone_id,
        shipping_weight_id: dto.weight_id,
        price: dto.price,
      }),
    );
    return this.ormRepository.save(entries);
  }

  async save(price: ShippingPrice): Promise<ShippingPrice> {
    return this.ormRepository.save(price);
  }

  async remove(price: ShippingPrice): Promise<void> {
    await this.ormRepository.remove(price);
  }
}
