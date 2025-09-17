// src/modules/users/domain/models/IUserToken.ts
export interface IUserToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
