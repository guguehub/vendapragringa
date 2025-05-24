import { IShippingZonesRepository } from "../domain/repositories/IShippingZonesRepository";

class ListShippingZonesService {
  constructor(private zoneRepository: IShippingZonesRepository) {}

  public async execute() {
    return this.zoneRepository.findAll();
  }
}
