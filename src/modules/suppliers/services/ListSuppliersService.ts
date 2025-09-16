// src/modules/suppliers/services/ListSuppliersService.ts
import { inject, injectable } from 'tsyringe';
import { ISupplierRepository } from '../domain/repositories/ISupplierRepository';
import { IItem } from '@modules/item/domain/models/IItem';
import { ISupplier } from '../domain/models/ISupplier';

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

interface IRequest {
  user_id?: string; // agora opcional
}

@injectable()
export default class ListSuppliersService {
  constructor(
    @inject('SupplierRepository')
    private suppliersRepository: ISupplierRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<CleanSupplier[]> {
    // Busca todos suppliers (global + user)
    // Usamos findAll() do ISupplierRepository
    const allSuppliers: ISupplier[] = await this.suppliersRepository.findAll();

    // Filtra suppliers customizados do usuário se user_id existir
    const filteredSuppliers = allSuppliers.filter(supplier => {
      if (user_id) {
        // custom suppliers do usuário
        return supplier.user_id === user_id || supplier.user_id === null;
      }
      // se não houver user_id, retorna apenas globais
      return supplier.user_id === null;
    });

    return filteredSuppliers.map(supplier => ({
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
      items: supplier.items?.map((item: IItem): CleanItem => ({
        id: item.id,
        title: item.title,
        price: item.price,
        status: item.status,
      })) ?? [],
    }));
  }
}
