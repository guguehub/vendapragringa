import { IUpdateSupplier } from '@modules/suppliers/domain/models/IUpdateSupplier';
import { ISuppliersRepository } from '@modules/suppliers/domain/repositories/ISuppliersRepository';

class UpdateSupplierService {
  constructor(private suppliersRepository: ISuppliersRepository) {}

  public async execute(id: string, data: IUpdateSupplier) {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) throw new Error('Supplier not found');

    // If the supplier is a marketplace type, address is optional
    if (supplier.type === 'mercadoLivre' || supplier.type === 'olx') {
      data.address = undefined; // Remove address for Mercado Livre and OLX suppliers
    }

    Object.assign(supplier, data);
    await this.suppliersRepository.save(supplier);
    return supplier;
  }
}

export default UpdateSupplierService;
