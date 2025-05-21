import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingWeight from '../entities/ShippingWeight';
import { IShippingWeightRepository } from '@modules/shipping/domain/repositories/IShippingWeightRepository';

export class ShippingWeightsRepository implements IShippingWeightRepository {
  private ormRepo: Repository<ShippingWeight>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingWeight);
  }

  async findByWeight(weight: number) {
    return this.ormRepo
      .createQueryBuilder('weight')
      .where(':weight BETWEEN weight.min AND weight.max', { weight })
      .getOne();
  }
   async findAll() {
    return this.ormRepo.find();
  }
}
