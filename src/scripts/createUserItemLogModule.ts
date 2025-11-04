// scripts/createUserItemLogModule.ts
import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('src/modules/user_item_log');

const files: Record<string, string> = {
  // Domain
  'domain/models/IUserItemLog.ts': `export interface IUserItemLog {
  id?: string;
  user_item_id: string;
  user_id?: string | null;
  action: string;
  metadata?: Record<string, any>;
  created_at?: Date;
}`,

  'domain/repositories/IUserItemLogRepository.ts': `import { IUserItemLog } from '../models/IUserItemLog';

export interface IUserItemLogRepository {
  create(log: IUserItemLog): Promise<IUserItemLog>;
  listByUserItemId(user_item_id: string): Promise<IUserItemLog[]>;
  countUniqueUsers(user_item_id: string): Promise<number>;
}`,

  // Infra TypeORM
  'infra/typeorm/entities/UserItemLog.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_item_logs')
export default class UserItemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_item_id: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column()
  action: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}`,

  'infra/typeorm/repositories/UserItemLogRepository.ts': `import { Repository } from 'typeorm';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';
import { IUserItemLog } from '@modules/user_item_log/domain/models/IUserItemLog';
import UserItemLog from '../entities/UserItemLog';
import dataSource from '@shared/infra/typeorm/data-source';

export class UserItemLogRepository implements IUserItemLogRepository {
  private ormRepository: Repository<UserItemLog>;

  constructor() {
    this.ormRepository = dataSource.getRepository(UserItemLog);
  }

  public async create(log: IUserItemLog): Promise<IUserItemLog> {
    const entity = this.ormRepository.create(log);
    await this.ormRepository.save(entity);
    return entity;
  }

  public async listByUserItemId(user_item_id: string): Promise<IUserItemLog[]> {
    return this.ormRepository.find({ where: { user_item_id } });
  }

  public async countUniqueUsers(user_item_id: string): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder('log')
      .where('log.user_item_id = :user_item_id', { user_item_id })
      .andWhere('log.user_id IS NOT NULL')
      .select('COUNT(DISTINCT log.user_id)', 'count')
      .getRawOne();
    return Number(result.count);
  }
}`,

  // Services
  'services/CreateUserItemLogService.ts': `import { inject, injectable } from 'tsyringe';
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
}`,

  'services/ListUserItemLogsService.ts': `import { inject, injectable } from 'tsyringe';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';
import { IUserItemLog } from '@modules/user_item_log/domain/models/IUserItemLog';

@injectable()
export default class ListUserItemLogsService {
  constructor(
    @inject('UserItemLogRepository')
    private repository: IUserItemLogRepository,
  ) {}

  public async execute(user_item_id: string): Promise<IUserItemLog[]> {
    return this.repository.listByUserItemId(user_item_id);
  }
}`,

  'services/GetUserItemMetricsService.ts': `import { inject, injectable } from 'tsyringe';
import { IUserItemLogRepository } from '@modules/user_item_log/domain/repositories/IUserItemLogRepository';

@injectable()
export default class GetUserItemMetricsService {
  constructor(
    @inject('UserItemLogRepository')
    private repository: IUserItemLogRepository,
  ) {}

  public async execute(user_item_id: string) {
    const logs = await this.repository.listByUserItemId(user_item_id);
    const uniqueUsers = await this.repository.countUniqueUsers(user_item_id);
    return { total: logs.length, uniqueUsers };
  }
}`,
};

// --- Create folders and files ---
for (const [relativePath, content] of Object.entries(files)) {
  const filePath = path.join(baseDir, relativePath);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
}

console.log('✅ Módulo user_item_log criado com sucesso!');
