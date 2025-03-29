import { IItem } from '@modules/item/domain/models/IItem';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;

  items?: IItem[]; // Items associated with the user
  created_at: Date;
  updated_at: Date;
}
