// src/modules/suppliers/domain/models/ISupplier.ts
import { IItem } from '@modules/item/domain/models/IItem';
import { IMarketplaces } from './IMarketplaces';

export interface ISupplier {
  id: string;
  name: string;
  marketplace: IMarketplaces;
  external_id?: string;
  email?: string;
  link?: string;
  website?: string;
  url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  status: 'ready' | 'listed' | 'sold';
  is_active: boolean;
  items?: IItem[];
  created_at: Date;
  updated_at: Date;
}
