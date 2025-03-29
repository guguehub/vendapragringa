import { Repository } from 'typeorm';
import Supplier from '@modules/suppliers/infra/typeorm/entities/Supplier';
import { ISuppliersRepository } from '@modules/suppliers/domain/repositories/ISuppliersRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { IUpdateSupplier } from '@modules/suppliers/domain/models/IUpdateSupplier';
import { dataSource } from '@shared/infra/typeorm';

class SuppliersRepository implements ISuppliersRepository {
  private ormRepository: Repository<Supplier>;

  constructor() {
    this.ormRepository = dataSource.getRepository(Supplier);
  }

  public async create({
    name,
    email,
    phone,
    address,
    type,
  }: ICreateSupplier): Promise<Supplier> {
    const supplier = this.ormRepository.create({
      name,
      email,
      phone,
      address,
      type,
    });

    await this.ormRepository.save(supplier);
    return supplier;
  }

  public async save(supplier: Supplier): Promise<Supplier> {
    return await this.ormRepository.save(supplier);
  }

  public async remove(supplier: Supplier): Promise<void> {
    await this.ormRepository.remove(supplier);
  }

  public async findById(id: string): Promise<Supplier | null> {
    return await this.ormRepository.findOne({
      where: { id },
      relations: ['products'], // Load related products
    });
  }

  public async findAll(): Promise<Supplier[]> {
    return await this.ormRepository.find({
      relations: ['products'], // Load related products
    });
  }

  public async findByType(
    type: 'mercadoLivre' | 'olx' | 'custom',
  ): Promise<Supplier[]> {
    return await this.ormRepository.find({
      where: { type } as any, // 👈 FIX: Explicitly casting `where` to `any`
      relations: ['products'],
    });
  }
}

export default SuppliersRepository;
