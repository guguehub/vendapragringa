import { IItem } from '@modules/item/domain/models/IItem';

export interface ISupplier {
  id: string;
  name: string;
  marketplace?: 'mercado_livre' | 'olx' | 'custom'; // Optional if not from a marketplace
  external_id?: string; // Marketplace supplier ID (e.g., Mercado Livre ID)
  items?: IItem[]; // Items associated with the supplier

  email?: string;
  link?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  //user;
  //userId;
  //products;
}

export interface ISupplier {
  id: string;
  name: string;
  contactInfo: string;
  created_at: Date;
  updated_at: Date;
}
