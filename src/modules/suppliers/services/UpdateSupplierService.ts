import { IUpdateSupplier } from '@modules/suppliers/domain/models/IUpdateSupplier';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { SupplierStatus } from '../domain/enums/supplier-status.enum';

// Erro customizado
export class SupplierNotFoundError extends Error {
  constructor(message = 'Supplier not found') {
    super(message);
    this.name = 'SupplierNotFoundError';
  }
}

export default class UpdateSupplierService {
  constructor(private suppliersRepository: ISupplierRepository) {}

  public async execute(data: IUpdateSupplier): Promise<ISupplier> {
    // Busca o supplier pelo id
    const supplier = await this.suppliersRepository.findById(data.id);
    if (!supplier) {
      throw new SupplierNotFoundError();
    }

    // Atualiza apenas campos permitidos
    const updatedSupplier: IUpdateSupplier = {
      id: supplier.id,
      name: data.name ?? supplier.name,
      email: data.email ?? supplier.email,
      link: data.link ?? supplier.link,
      website: data.website ?? supplier.website,
      url: data.url ?? supplier.url,
      address: data.address ?? supplier.address,
      city: data.city ?? supplier.city,
      state: data.state ?? supplier.state,
      country: data.country ?? supplier.country,
      zip_code: data.zip_code ?? supplier.zip_code,
      status: data.status ?? (supplier.status as SupplierStatus),
      is_active: data.is_active ?? supplier.is_active,
    };

    // Salva via repository
    const savedSupplier = await this.suppliersRepository.save(updatedSupplier);

    // Garante que items é sempre array
    if (!savedSupplier.items) {
      savedSupplier.items = [];
    }

    return savedSupplier;
  }
}
