// src/modules/users/infra/typeorm/repositories/UserTokensRepository.ts
import { Repository } from 'typeorm';
import UserToken from '../entities/UserToken';
import { IUserTokensRepository } from '../../../domain/repositories/IUserTokensRepository';
import dataSource from '@shared/infra/typeorm/data-source';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    return await this.ormRepository.findOne({
      where: { token },
    });
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ userId });
    return await this.ormRepository.save(userToken);
  }
}

export default UserTokensRepository;
