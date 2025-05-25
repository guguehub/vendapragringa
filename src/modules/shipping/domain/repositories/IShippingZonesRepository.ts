import ShippingZone from '../../infra/typeorm/entities/ShippingZone';

export interface IShippingZonesRepository {
  findAll(): Promise<ShippingZone[]>;
  findById(id: string): Promise<ShippingZone | null>;
  findByCode(code: string): Promise<ShippingZone | null>;
  findByName(name: string): Promise<ShippingZone | null>;
  findByCountryCode(countryCode: string): Promise<ShippingZone | null>;
  create(data: { name: string; code: string }): Promise<ShippingZone>;
  createMany(zones: Partial<ShippingZone>[]): Promise<void>;
}
