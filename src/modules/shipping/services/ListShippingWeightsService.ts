import { IShippingWeightRepository } from "../domain/repositories/IShippingWeightRepository";

class ListShippingWeightsService {
  constructor(private weightRepository: IShippingWeightRepository) {}

  public async execute() {
    return this.weightRepository.findAll();
  }
}
