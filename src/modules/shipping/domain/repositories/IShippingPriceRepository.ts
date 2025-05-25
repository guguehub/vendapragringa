import { ICreateShippingPriceDTO } from '@modules/shipping/dtos/ICreateShippingPriceDTO';
import ShippingPrice from '../../infra/typeorm/entities/ShippingPrice';

export interface IShippingPriceRepository {
  findByDetails(params: {
    zoneId: string | null;
    typeId: string | null;
    weightId: string | null;
  }): Promise<ShippingPrice | null>;

  findById(id: string): Promise<ShippingPrice | null>;
  save(price: ShippingPrice): Promise<ShippingPrice | undefined>;
  create(pricesData: ICreateShippingPriceDTO): Promise<ShippingPrice>;
  remove(price: ShippingPrice): Promise<void>;
}
