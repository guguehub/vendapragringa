import { ISupplier } from '@modules/suppliers/domain/models/ISupplier';
import { IUser } from '@modules/users/domain/models/IUser';

export interface IItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  supplier?: ISupplier;
  supplierId?: string;
  user: IUser;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
