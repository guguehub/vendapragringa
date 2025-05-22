class ListShippingZonesService {
  constructor(private zoneRepository: IShippingZoneRepository) {}

  public async execute() {
    return this.zoneRepository.findAll();
  }
}
