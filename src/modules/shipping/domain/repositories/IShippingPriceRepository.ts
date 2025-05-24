import ShippingPrice from '../../infra/typeorm/entities/ShippingPrice';

export interface IShippingPriceRepository {
  findByDetails(params: {
    zoneId: string | null;
    typeId: string | null;
    weightId: string | null;
  }): Promise<ShippingPrice | null>;

  findById(id: string): Promise<ShippingPrice | null>;
  save(price: ShippingPrice): Promise<ShippingPrice | undefined>;
  create(price: ShippingPrice): Promise<void>;
  remove(price: ShippingPrice): Promise<void>;
}
