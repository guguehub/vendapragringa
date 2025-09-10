import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ISupplierRepository } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ICreateSupplier } from '@modules/suppliers/domain/models/ICreateSupplier';
import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { SearchParams } from '@modules/suppliers/domain/repositories/ISupplierRepository';
import { ISupplierPaginate } from '@modules/suppliers/domain/models/ISupplierPaginate';

@injectable()
class SupplierService {
  constructor(
    @inject('SupplierRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  // Cria um supplier
  public async create(data: ICreateSupplier): Promise<ISupplier> {
    const supplier = await this.suppliersRepository.create(data);
    return supplier;
  }

  // Busca supplier por ID
  public async findById(id: string): Promise<ISupplier> {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }
    return supplier;
  }

  // Retorna todos os suppliers com paginação
  public async findAll(params?: SearchParams): Promise<ISupplierPaginate> {
    return await this.suppliersRepository.findAll(params ?? { page: 1, skip: 0, take: 50 });
  }
}

export default SupplierService;
