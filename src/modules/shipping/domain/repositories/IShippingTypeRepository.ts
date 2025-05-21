import ShippingType from '../../infra/typeorm/entities/ShippingType';

export interface IShippingTypeRepository {
  findByCode(code: 'document' | 'product'): Promise<ShippingType | undefined>;
}
