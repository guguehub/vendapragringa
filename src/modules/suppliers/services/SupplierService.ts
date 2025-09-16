import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';

@injectable()
class SupplierService {
  constructor(
    @inject('SupplierRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  // Cria um supplier
  public async create(data: ICreateSupplier): Promise<ISupplier> {
    return await this.suppliersRepository.create(data);
  }

  // Busca supplier por ID
  public async findById(id: string): Promise<ISupplier> {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) throw new AppError('Supplier not found', 404);
    return supplier;
  }

  // Retorna todos os suppliers sem paginação
  public async findAll(): Promise<ISupplier[]> {
    return await this.suppliersRepository.findAll();
  }
}

export default SupplierService;
