import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { IMarketplaces } from '@modules/suppliers/domain/models/IMarketplaces';

export default class CreateSupplierService {
  constructor(private suppliersRepository: ISupplierRepository) {}

  public async execute(data: ICreateSupplier): Promise<ISupplier> {
    // Se for marketplace "mercado_livre" ou "olx", endereço e localização são opcionais
    if (data.marketplace === IMarketplaces.MERCADO_LIVRE || data.marketplace === IMarketplaces.OLX) {
      data.address = undefined;
      data.city = undefined;
      data.state = undefined;
      data.country = undefined;
      data.zip_code = undefined;
    }

    // Garante status e is_active
    const supplierData: ICreateSupplier = {
      ...data,
      status: data.status ?? 'active',
      is_active: data.is_active ?? true,
    };

    // Criação via repository
    const supplier: ISupplier = await this.suppliersRepository.create(supplierData);

    // Garante que o campo items nunca seja undefined
    if (!supplier.items) {
      supplier.items = [];
    }

    return supplier;
  }
}
