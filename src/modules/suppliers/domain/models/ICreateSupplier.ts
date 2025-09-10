import { IMarketplaces } from "./IMarketplaces";

export interface ICreateSupplier {
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
  status?: 'ready' | 'listed' | 'sold';
  is_active?: boolean;
}
