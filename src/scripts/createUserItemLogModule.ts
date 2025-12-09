// src/modules/user_item_log/services/CreateUserItemLogService.ts
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
    if (!data.user_id) {
      throw new Error('user_id é obrigatório para criar um log de UserItem');
    }

    const log = await this.repository.create(data);
    console.log(`[UserItemLog] 📗 Log criado: ${data.action} para user:${data.user_id}`);
    return log;
  }
}
