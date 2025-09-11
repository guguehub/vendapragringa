import { IItem } from "@modules/item/domain/models/IItem";

export interface ISupplier {
  id: string;
  name: string;
  marketplace: string;
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
  status: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  items?: IItem[];
}
