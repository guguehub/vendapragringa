import ShippingWeight from '../../infra/typeorm/entities/ShippingWeight';

export interface IShippingWeightRepository {
  findByWeight(weight: number): Promise<ShippingWeight | undefined>;
}
