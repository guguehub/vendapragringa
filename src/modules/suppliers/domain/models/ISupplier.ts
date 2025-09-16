import { IItem } from "@modules/item/domain/models/IItem";
import { IMarketplaces } from "./IMarketplaces";
import { SupplierStatus } from "../enums/supplier-status.enum";

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
  status: SupplierStatus;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  user_id?: string; // suppliers custom
  items?: IItem[];
}
