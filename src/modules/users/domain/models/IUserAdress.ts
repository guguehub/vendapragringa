import { IUser } from './IUser';

export interface IUserAddress {
  id: string;
  userId: string;
  user?: IUser;

  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string; // ex: SP
  country: string;
  postalCode: string; // CEP ou equivalente

  phoneNumber?: string; // formato internacional opcional: +55 11 91234-5678
  isPrimary?: boolean; // indica endereço principal do usuário

  createdAt: Date;
  updatedAt: Date;
}
