// /src/modules/suppliers/services/ListSuppliersService.ts
import { inject, injectable } from 'tsyringe';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';

type CleanItem = {
  id: string;
  title: string;
  price: number;
  status: string;
};

type CleanSupplier = {
  id: string;
  name: string;
  marketplace: string;
  email?: string;
  link?: string;
  website?: string;
  url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  status: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  items: CleanItem[];
};

@injectable()
export default class ListSuppliersService {
  constructor(
    @inject('SupplierRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  public async execute(): Promise<CleanSupplier[]> {
    const result = await this.suppliersRepository.findAll({
      page: 1,
      skip: 0,
      take: 1000,
    });

    return result.data.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      marketplace: supplier.marketplace,
      email: supplier.email,
      link: supplier.link,
      website: supplier.website,
      url: supplier.url,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      country: supplier.country,
      zip_code: supplier.zip_code,
      status: supplier.status,
      is_active: supplier.is_active,
      created_at: supplier.created_at,
      updated_at: supplier.updated_at,
      items: supplier.items?.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        status: item.status,
      })) ?? [],
    }));
  }
}
