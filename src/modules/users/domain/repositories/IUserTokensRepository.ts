import { IUserToken } from '../../../users/domain/models/IUserToken';

export interface IUserTokensRepository {
  findByToken(token: string): Promise<IUserToken | null>;
  generate(user_id: string): Promise<IUserToken>;
}
