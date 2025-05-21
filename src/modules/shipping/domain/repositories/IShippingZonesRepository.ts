import ShippingZone from "@modules/shipping/infra/typeorm/entities/ShippingZone";

export interface IShippingZonesRepository {
  findAll(): Promise<ShippingZone[]>;
  findById(id: string): Promise<ShippingZone | null>;
  findByCountryCode(code: string): Promise<ShippingZone | null>;
}
