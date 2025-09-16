// src/modules/suppliers/services/CreateSupplierService.ts
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { IMarketplaces } from '@modules/suppliers/domain/models/IMarketplaces';
import { SupplierStatus } from '@modules/suppliers/domain/enums/supplier-status.enum';

export default class CreateSupplierService {
  constructor(private suppliersRepository: ISupplierRepository) {}

  public async execute(data: ICreateSupplier): Promise<ISupplier> {
    const isMarketplace = Object.values(IMarketplaces).includes(
      data.marketplace as IMarketplaces,
    );

    if (isMarketplace) {
      // Para marketplaces oficiais (ex: Mercado Livre, OLX), endereço e localização são ignorados
      if (
        data.marketplace === IMarketplaces.MERCADO_LIVRE ||
        data.marketplace === IMarketplaces.OLX
      ) {
        data.address = undefined;
        data.city = undefined;
        data.state = undefined;
        data.country = undefined;
        data.zip_code = undefined;
      }
    } else {
      // Para custom suppliers, podemos exigir dados mínimos (nome + endereço/cidade)
      if (!data.address || !data.city) {
        throw new Error(
          'Custom suppliers precisam de pelo menos endereço e cidade definidos',
        );
      }
    }

    // Garante status e is_active usando enum SupplierStatus
    const supplierData: ICreateSupplier = {
      ...data,
      status: data.status ?? SupplierStatus.ACTIVE,
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
