import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';

// Erro customizado
export class SupplierNotFoundError extends Error {
  constructor(message = 'Supplier not found') {
    super(message);
    this.name = 'SupplierNotFoundError';
  }
}

export default class RemoveSupplierService {
  constructor(private suppliersRepository: ISupplierRepository) {}

  public async execute(supplierId: string): Promise<void> {
    // Busca o supplier pelo ID
    const supplier = await this.suppliersRepository.findById(supplierId);
    if (!supplier) {
      throw new SupplierNotFoundError();
    }

    // Remove via repository
    await this.suppliersRepository.remove(supplier);
  }
}
