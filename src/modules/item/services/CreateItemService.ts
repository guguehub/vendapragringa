// src/modules/item/services/CreateItemService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/item/domain/repositories/IItemsRepository';
import { ICreateItem } from '@modules/item/domain/models/ICreateItem';
import Item from '@modules/item/infra/typeorm/entities/Item';
import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';

@injectable()
class CreateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('SuppliersRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  public async execute(userId: string, data: ICreateItem): Promise<Item> {
    const { externalId, marketplace, supplierId } = data;

    // 1️⃣ Busca o supplier (opcional)
    let supplier: Supplier | undefined;
    if (supplierId) {
      const supplierFound = await this.suppliersRepository.findById(supplierId);
      if (!supplierFound) {
        throw new AppError('Supplier not found', 404);
      }
      supplier = supplierFound as Supplier;
    }

    // 2️⃣ Busca item existente pelo marketplace + externalId
    let item: Item | null = null;
    if (externalId && marketplace) {
      item = await this.itemsRepository.findByExternalId(externalId, marketplace);
    }

    if (item) {
      // ✅ Item já existe: atualiza campos relevantes
      const updatedData: Partial<ICreateItem> = {
        ...data,
        supplier,
      };

      return this.itemsRepository.update(item.id, updatedData);
    }

    // 3️⃣ Item não existe: cria novo
    const newItem = await this.itemsRepository.create({
      ...data,
      isDraft: data.isDraft ?? false,
      isSynced: data.isSynced ?? false,
      importStage: data.importStage ?? 'draft',
      createdBy: userId,
      supplier,
    });

    return newItem;
  }
}

export default CreateItemService;
