import ShippingPrice from '../../infra/typeorm/entities/ShippingPrice';

export interface IShippingPriceRepository {
  findByDetails(params: {
    zoneId: string;
    typeId: string;
    weightId: string;
  }): Promise<ShippingPrice | undefined>;
}
