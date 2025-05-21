export interface ICreateSupplier {
  name: string;
  marketplace?: 'mercado_livre' | 'olx' | 'custom';
  external_id?: string;
  email?: string;
  link?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  is_active?: boolean;
}
