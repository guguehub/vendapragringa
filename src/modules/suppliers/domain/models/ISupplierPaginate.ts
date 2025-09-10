import { ISupplier } from './ISupplier';

export interface ISupplierPaginate {
  per_page: number;
  total: number;
  current_page: number;
  data: ISupplier[];
}
