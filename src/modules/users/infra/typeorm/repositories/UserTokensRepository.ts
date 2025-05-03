import { Repository } from 'typeorm';
import UserToken from '../entities/UserToken';
import { IUserTokensRepository } from '../../../domain/repositories/IUserTokensRepository';
import { IUserToken } from '../../../domain/models/IUserToken';
import dataSource from '@shared/infra/typeorm';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken as IUserToken | null;
  }

  public async generate(userId: string): Promise<IUserToken> {
    const userToken = this.ormRepository.create({ userId });
    await this.ormRepository.save(userToken);
    return userToken as IUserToken;
  }
}

export default UserTokensRepository;
