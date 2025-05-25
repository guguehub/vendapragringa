import { Repository } from 'typeorm';
import dataSource from '@shared/infra/typeorm';
import ShippingWeight from '../entities/ShippingWeight';
import { IShippingWeightRepository } from '@modules/shipping/domain/repositories/IShippingWeightRepository';

export class ShippingWeightsRepository implements IShippingWeightRepository {
  private ormRepo: Repository<ShippingWeight>;

  constructor() {
    this.ormRepo = dataSource.getRepository(ShippingWeight);
  }

  async findAll(): Promise<ShippingWeight[]> {
    return this.ormRepo.find();
  }

  async findByWeight(weight: number): Promise<ShippingWeight | null> {
    return this.ormRepo
      .createQueryBuilder('weight')
      .where(':weight BETWEEN weight.min_weight AND weight.max_weight', { weight })
      .getOne();
  }

  async findById(id: string): Promise<ShippingWeight | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async createMany(weights: Partial<ShippingWeight>[]): Promise<void> {
    const newWeights = this.ormRepo.create(weights);
    await this.ormRepo.save(newWeights);
  }
}
