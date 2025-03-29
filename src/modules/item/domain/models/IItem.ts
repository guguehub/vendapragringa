import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { IUser } from '@modules/users/domain/models/IUser';

export interface IItem {
  id: string;
  name: string;
  description: string;
  price: number;
  supplier: ISupplier; // Supplier associated with the item
  // Additional item-specific properties
  user: IUser; // User associated with the item
  created_at: Date;
  updated_at: Date;
}
