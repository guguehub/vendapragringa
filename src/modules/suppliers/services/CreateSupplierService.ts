import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISuppliersRepository } from '@modules/suppliers/domain/repositories/ISuppliersRepository';
import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';

class CreateSupplierService {
  constructor(private suppliersRepository: ISuppliersRepository) {}

  public async execute(data: ICreateSupplier): Promise<Supplier> {
    // If the supplier is a marketplace type, address is optional
    if (data.type === 'mercadoLivre' || data.type === 'olx') {
      data.address = undefined; // Clear address for Mercado Livre and OLX suppliers
    }

    const supplier = await this.suppliersRepository.create(data);
    return supplier;
  }
}

export default CreateSupplierService;
