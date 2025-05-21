import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ISuppliersRepository } from '@modules/suppliers/domain/repositories/ISuppliersRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';

@injectable()
class SupplierService {
  constructor(
    @inject('SuppliersRepository')
    private suppliersRepository: ISuppliersRepository,
  ) {}

  // ✅ Create Supplier (Only Admins or Special Users)
  public async create(data: ICreateSupplier): Promise<ISupplier> {
    const supplier = await this.suppliersRepository.create(data);
    return supplier;
  }

  // ✅ Any user can access suppliers (marketplaces)
  public async findById(id: string): Promise<ISupplier> {
    const supplier = await this.suppliersRepository.findById(id);

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return supplier;
  }

  // ✅ Return all suppliers (marketplaces) for everyone
  public async findAll(): Promise<ISupplier[]> {
    return await this.suppliersRepository.findAll();
  }
}

export default SupplierService;
