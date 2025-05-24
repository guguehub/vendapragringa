import { IShippingTypeRepository } from "../domain/repositories/IShippingTypeRepository";

class ListShippingTypesService {
  constructor(private typeRepository: IShippingTypeRepository) {}

  public async execute() {
    return this.typeRepository.findAll();
  }
}
