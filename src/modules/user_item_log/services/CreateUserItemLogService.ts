import { inject, injectable } from 'tsyringe';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';
import { IUserItemLog } from '@modules/user_item_log/domain/models/IUserItemLog';

@injectable()
export default class CreateUserItemLogService {
  constructor(
    @inject('UserItemLogRepository')
    private repository: IUserItemLogRepository,
  ) {}

  public async execute(data: IUserItemLog): Promise<IUserItemLog> {
    return this.repository.create(data);
  }
}