import { Repository } from 'typeorm';
import Supplier from '../entities/Supplier';
import { ISuppliersRepository } from '@modules/suppliers/domain/repositories/ISuppliersRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplierPaginate } from '@modules/suppliers/domain/models/ISupplierPaginate';
import { dataSource } from '@shared/infra/typeorm/data-source';
import { SearchParams } from '@modules/suppliers/domain/repositories/ISuppliersRepository';

class SuppliersRepository implements ISuppliersRepository {
  private ormRepository: Repository<Supplier>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Supplier);
  }

  public async create({
    name,
    marketplace,
    external_id,
  }: ICreateSupplier): Promise<Supplier> {
    const supplier = this.ormRepository.create({
      name,
      marketplace,
      external_id,
    });

    await this.ormRepository.save(supplier);
    return supplier;
  }

  public async save(supplier: Supplier): Promise<Supplier> {
    return this.ormRepository.save(supplier);
  }

  public async remove(supplier: Supplier): Promise<void> {
    await this.ormRepository.remove(supplier);
  }

  public async findByName(name: string): Promise<Supplier | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<Supplier | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['products'],
    }); // Ensure relations are loaded
  }

  public async findByExternalId(
    external_id: string,
    marketplace: string,
  ): Promise<Supplier | null> {
    return this.ormRepository.findOne({
      where: { external_id, marketplace },
    });
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<ISupplierPaginate> {
    const [suppliers, count] = await this.ormRepository.findAndCount({
      skip,
      take,
      order: { name: 'ASC' }, // Sorted alphabetically for better UX
    });

    return {
      per_page: take,
      total: count,
      current_page: page,
      data: suppliers,
    };
  }
}

export default SuppliersRepository;
