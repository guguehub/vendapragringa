import { Repository, DataSource } from 'typeorm';
import ShippingType from '../entities/ShippingType';
import { IShippingTypeRepository } from '@modules/shipping/domain/repositories/IShippingTypeRepository';
import { ShippingTypeCode } from '@modules/shipping/enums/ShippingTypeCode';

export class ShippingTypesRepository implements IShippingTypeRepository {
  private ormRepository: Repository<ShippingType>;

  constructor(private dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(ShippingType);
  }

  async findByCode(code: ShippingTypeCode): Promise<ShippingType | null> {
    return this.ormRepository.findOne({ where: { code } });
  }

  async create(data: { name: string; code: ShippingTypeCode }): Promise<ShippingType> {
    const type = this.ormRepository.create(data);
    return this.ormRepository.save(type);
  }

  async findAll(): Promise<ShippingType[]> {
    return this.ormRepository.find();
  }
}
