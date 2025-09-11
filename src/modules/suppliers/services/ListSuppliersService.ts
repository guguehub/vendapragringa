import { inject, injectable } from 'tsyringe';
import { ISupplier } from '../domain/models/ISupplier';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';

@injectable()
export default class ListSuppliersService {
  constructor(
    @inject('SupplierRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  public async execute(): Promise<ISupplier[]> {
    return this.suppliersRepository.findAll();
  }
}
