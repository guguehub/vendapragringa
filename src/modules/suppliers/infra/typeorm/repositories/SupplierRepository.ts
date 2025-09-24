import { Repository } from 'typeorm';
import Supplier from '../entities/Supplier';
import Item from '@modules/item/infra/typeorm/entities/Item';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { IUpdateSupplier } from '@modules/suppliers/domain/models/IUpdateSupplier';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { IItem } from '@modules/item/domain/models/IItem';
import dataSource from '@shared/infra/typeorm/data-source';
import { IMarketplaces } from '@modules/suppliers/domain/models/IMarketplaces';
import { ItemStatus } from '@modules/item/domain/enums/item-status.enum';
import { SupplierStatus } from '@modules/suppliers/domain/enums/supplier-status.enum';

// Erro customizado
export class SupplierNotFoundError extends Error {
  constructor(message = 'Supplier not found') {
    super(message);
    this.name = 'SupplierNotFoundError';
  }
}

// Mapeamento entidade -> ISupplier
// Mapeamento entidade -> ISupplier
function mapSupplierEntityToISupplier(supplier: Supplier): ISupplier {
  return {
    id: supplier.id,
    name: supplier.name,
    marketplace: supplier.marketplace ?? IMarketplaces.CUSTOM, // default para CUSTOM
    external_id: supplier.external_id,
    email: supplier.email,
    link: supplier.link,
    website: supplier.website,
    url: supplier.url,
    address: supplier.address,
    city: supplier.city,
    state: supplier.state,
    country: supplier.country,
    zip_code: supplier.zip_code,
    status: supplier.status as SupplierStatus,
    is_active: supplier.is_active,
    created_at: supplier.created_at,
    updated_at: supplier.updated_at,
    items:
      supplier.items?.map(
        (i: Item): IItem => ({
          id: i.id,
          title: i.title,
          description: i.description,
          price: i.price,
          externalId: i.externalId,
          marketplace: i.marketplace,
          shippingPrice: i.shippingPrice,
          status: i.status as ItemStatus,
          itemLink: i.itemLink,
          lastScrapedAt: i.lastScrapedAt,
          images: i.images ?? undefined, // apenas 1 foto opcional
          importStage: i.importStage,
          isDraft: i.isDraft,
          isSynced: i.isSynced,
          createdBy: i.createdBy,
          created_at: i.created_at,
          updated_at: i.updated_at,
        }),
      ) ?? [],
  };
}


export default class SupplierRepository implements ISupplierRepository {
  private ormRepository: Repository<Supplier>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Supplier);
  }

  public async create(data: ICreateSupplier): Promise<ISupplier> {
    const supplier = this.ormRepository.create({
      ...data,
      status: data.status ?? SupplierStatus.ACTIVE,
      is_active: data.is_active ?? true,
    });

    supplier.items = [];

    await this.ormRepository.save(supplier);
    return mapSupplierEntityToISupplier(supplier);
  }

  public async save(data: IUpdateSupplier): Promise<ISupplier> {
    const supplier = await this.ormRepository.findOne({
      where: { id: data.id },
      relations: ['items'],
    });
    if (!supplier) throw new SupplierNotFoundError();

    Object.assign(supplier, {
      name: data.name ?? supplier.name,
      url: data.url ?? supplier.url,
      email: data.email ?? supplier.email,
      link: data.link ?? supplier.link,
      website: data.website ?? supplier.website,
      address: data.address ?? supplier.address,
      city: data.city ?? supplier.city,
      state: data.state ?? supplier.state,
      country: data.country ?? supplier.country,
      zip_code: data.zip_code ?? supplier.zip_code,
      status: data.status ?? supplier.status,
      is_active: data.is_active ?? supplier.is_active,
    });

    await this.ormRepository.save(supplier);
    return mapSupplierEntityToISupplier(supplier);
  }

  public async remove(supplier: ISupplier): Promise<void> {
    const entity = await this.ormRepository.findOne({ where: { id: supplier.id } });
    if (entity) await this.ormRepository.remove(entity);
  }

  public async findByName(name: string): Promise<ISupplier | null> {
    const supplier = await this.ormRepository.findOne({
      where: { name },
      relations: ['items'],
    });
    if (!supplier) return null;
    return mapSupplierEntityToISupplier(supplier);
  }

  public async findById(id: string): Promise<ISupplier | null> {
    const supplier = await this.ormRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!supplier) return null;
    return mapSupplierEntityToISupplier(supplier);
  }

  public async findByExternalId(
    external_id: string,
    marketplace: IMarketplaces,
  ): Promise<ISupplier | null> {
    const supplier = await this.ormRepository.findOne({
      where: { external_id, marketplace },
      relations: ['items'],
    });
    if (!supplier) return null;
    return mapSupplierEntityToISupplier(supplier);
  }

  public async findAll(): Promise<ISupplier[]> {
    const suppliers = await this.ormRepository.find({
      order: { name: 'ASC' },
      relations: ['items'],
    });

    return suppliers.map(mapSupplierEntityToISupplier);
  }

  public async findGlobals(): Promise<ISupplier[]> {
    const suppliers = await this.ormRepository.find({
      where: { user_id: undefined }, // TypeORM aceita undefined para campos opcionais
      order: { name: 'ASC' },
      relations: ['items'],
    });

    return suppliers.map(mapSupplierEntityToISupplier);
  }

  public async findByUser(userId: string): Promise<ISupplier[]> {
    const suppliers = await this.ormRepository.find({
      where: { user_id: userId },
      order: { name: 'ASC' },
      relations: ['items'],
    });

    return suppliers.map(mapSupplierEntityToISupplier);
  }
}
