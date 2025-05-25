import { Repository, DataSource } from 'typeorm';
import ShippingType from '../entities/ShippingType';
import { IShippingTypeRepository } from '@modules/shipping/domain/repositories/IShippingTypeRepository';
import { ShippingTypeCode } from '@modules/shipping/enums/ShippingTypeCode';

export class ShippingTypesRepository implements IShippingTypeRepository {
  private ormRepo: Repository<ShippingType>;

  constructor(dataSource: DataSource) {
    this.ormRepo = dataSource.getRepository(ShippingType);
  }

  async findByCode(code: ShippingTypeCode): Promise<ShippingType | null> {
    return this.ormRepo.findOne({ where: { code } });
  }

  async create(data: { name: string; code: ShippingTypeCode }): Promise<ShippingType> {
    const type = this.ormRepo.create(data);
    return this.ormRepo.save(type);
  }

  async findAll(): Promise<ShippingType[]> {
    return this.ormRepo.find();
  }
}
