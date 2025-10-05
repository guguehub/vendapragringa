import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IItemsRepository } from '@modules/item/domain/repositories/IItemsRepository';
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

    // 1️⃣ Evita duplicata (mesmo externalId + marketplace)
    if (externalId && marketplace) {
      const existing = await this.itemsRepository.findByExternalId(
        externalId,
        marketplace,
      );
      if (existing) {
        throw new AppError('Item already exists for this marketplace', 409);
      }
    }

    // 2️⃣ Busca o supplier (opcional)
    let supplier: Supplier | undefined;
    if (supplierId) {
      const sup = await this.suppliersRepository.findById(supplierId);
      if (!sup) {
        throw new AppError('Supplier not found', 404);
      }
      // Aqui sup é ISupplier, mas ao criar Item precisamos apenas do id para relação
      supplier = new Supplier();
      supplier.id = sup.id;
    }

    // 3️⃣ Criação do item
    const item = await this.itemsRepository.create({
      title: data.title,
      description: data.description,
      price: data.price,
      shippingPrice: data.shippingPrice,
      status: data.status ?? 'ready',
      itemStatus: data.itemStatus,
      soldCount: data.soldCount,
      condition: data.condition,
      externalId: data.externalId,
      marketplace: data.marketplace,
      itemLink: data.itemLink,
      images: data.images,
      isDraft: data.isDraft ?? false,
      isSynced: data.isSynced ?? false,
      importStage: data.importStage ?? 'draft',
      createdBy: userId,
      supplier, // Supplier com apenas id setado
    });

    return item;
  }
}

export default CreateItemService;
