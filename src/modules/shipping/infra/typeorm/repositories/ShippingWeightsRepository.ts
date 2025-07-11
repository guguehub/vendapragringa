import { DataSource, Repository } from 'typeorm';
import ShippingWeight from '../entities/ShippingWeight';
import { IShippingWeightRepository } from '@modules/shipping/domain/repositories/IShippingWeightRepository';

export class ShippingWeightsRepository implements IShippingWeightRepository {
  private readonly ormRepository: Repository<ShippingWeight>;

  constructor(private readonly dataSource: DataSource) {
    this.ormRepository = this.dataSource.getRepository(ShippingWeight);
  }

  async findAll(): Promise<ShippingWeight[]> {
    return await this.ormRepository.find();
  }

  async findByWeight(weight: number): Promise<ShippingWeight | null> {
  return this.ormRepository
    .createQueryBuilder('weight')
    .where(':weight::float BETWEEN weight.min_kg::float AND weight.max_kg::float', { weight })
    .getOne();
}

  async findById(id: string): Promise<ShippingWeight | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  async createMany(weights: Partial<ShippingWeight>[]): Promise<void> {
    const newWeights = this.ormRepository.create(weights);
    await this.ormRepository.save(newWeights);
  }
}
