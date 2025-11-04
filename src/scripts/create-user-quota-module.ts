import fs from 'fs';
import path from 'path';

const basePath = path.resolve('src/modules/user_quota');

const files: Record<string, string> = {
  // DOMAIN
  'domain/models/IUserQuota.ts': `
export interface IUserQuota {
  id: string;
  user_id: string;
  scrape_count: number;
  scrape_balance: number;
  daily_bonus_count: number;
  item_limit: number;
  created_at: Date;
  updated_at: Date;
}
`,

  'domain/repositories/IUserQuotaRepository.ts': `
import { IUserQuota } from '../models/IUserQuota';

export default interface IUserQuotaRepository {
  findByUserId(user_id: string): Promise<IUserQuota | null>;
  createOrUpdate(data: Partial<IUserQuota>): Promise<IUserQuota>;
  incrementScrapeCount(user_id: string): Promise<void>;
  resetDailyBonus(user_id: string, bonusAmount: number): Promise<void>;
}
`,

  // INFRA
  'infra/typeorm/entities/UserQuota.ts': `
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_quotas')
export class UserQuota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ default: 0 })
  scrape_count: number;

  @Column({ default: 0 })
  scrape_balance: number;

  @Column({ default: 0 })
  daily_bonus_count: number;

  @Column({ default: 0 })
  item_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
`,

  'infra/typeorm/repositories/UserQuotaRepository.ts': `
import { Repository } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { UserQuota } from '../entities/UserQuota';
import IUserQuotaRepository from '@modules/user_quota/domain/repositories/IUserQuotaRepository';

export class UserQuotaRepository implements IUserQuotaRepository {
  private ormRepository: Repository<UserQuota>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserQuota);
  }

  async findByUserId(user_id: string): Promise<UserQuota | null> {
    return await this.ormRepository.findOne({ where: { user_id } });
  }

  async createOrUpdate(data: Partial<UserQuota>): Promise<UserQuota> {
    const existing = await this.findByUserId(data.user_id!);
    const merged = this.ormRepository.create({ ...existing, ...data });
    return this.ormRepository.save(merged);
  }

  async incrementScrapeCount(user_id: string): Promise<void> {
    await this.ormRepository.increment({ user_id }, 'scrape_count', 1);
  }

  async resetDailyBonus(user_id: string, bonusAmount: number): Promise<void> {
    await this.ormRepository.update({ user_id }, { daily_bonus_count: bonusAmount });
  }
}
`,

  // DTOS
  'dtos/ICheckUserQuotaDTO.ts': `
export interface ICheckUserQuotaDTO {
  user_id: string;
  subscription_tier: string;
}
`,

  'dtos/IUpdateUserQuotaDTO.ts': `
export interface IUpdateUserQuotaDTO {
  user_id: string;
  scrape_count?: number;
  scrape_balance?: number;
  daily_bonus_count?: number;
  item_limit?: number;
}
`,

  // SERVICES
  'services/UserQuotaService.ts': `
import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';
import { SubscriptionTierScrapeLimits } from '@modules/subscriptions/enums/subscription-tier-scrape-limits.enum';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import AppError from '@shared/errors/AppError';

@injectable()
export class UserQuotaService {
  constructor(
    @inject('UserQuotaRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  async checkQuota(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    const quota = await this.userQuotaRepository.findByUserId(user_id);

    if (!quota) throw new AppError('User quota not found.');

    const maxScrapes = SubscriptionTierScrapeLimits[tier];

    const remaining = quota.daily_bonus_count > 0
      ? quota.daily_bonus_count
      : quota.scrape_balance;

    if (tier === SubscriptionTier.INFINITY) return true;

    if (remaining <= 0 || quota.scrape_count >= maxScrapes) {
      throw new AppError('Daily scraping limit reached.');
    }

    return true;
  }

  async consumeScrape(user_id: string): Promise<void> {
    const quota = await this.userQuotaRepository.findByUserId(user_id);
    if (!quota) return;

    if (quota.daily_bonus_count > 0) {
      quota.daily_bonus_count -= 1;
    } else if (quota.scrape_balance > 0) {
      quota.scrape_balance -= 1;
    }

    quota.scrape_count += 1;
    await this.userQuotaRepository.createOrUpdate(quota);
  }

  async resetBonus(user_id: string, amount: number): Promise<void> {
    await this.userQuotaRepository.resetDailyBonus(user_id, amount);
  }
}
`,

  'services/CheckUserScrapeQuotaService.ts': `
import { injectable, inject } from 'tsyringe';
import { UserQuotaService } from './UserQuotaService';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

@injectable()
export class CheckUserScrapeQuotaService {
  constructor(
    @inject(UserQuotaService)
    private userQuotaService: UserQuotaService,
  ) {}

  async execute(user_id: string, tier: SubscriptionTier): Promise<boolean> {
    return this.userQuotaService.checkQuota(user_id, tier);
  }
}
`,

  'services/IncrementUserScrapeCountService.ts': `
import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';

@injectable()
export class IncrementUserScrapeCountService {
  constructor(
    @inject('UserQuotaRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  async execute(user_id: string): Promise<void> {
    await this.userQuotaRepository.incrementScrapeCount(user_id);
  }
}
`,

  'services/ResetDailyBonusService.ts': `
import { injectable, inject } from 'tsyringe';
import IUserQuotaRepository from '../domain/repositories/IUserQuotaRepository';

@injectable()
export class ResetDailyBonusService {
  constructor(
    @inject('UserQuotaRepository')
    private userQuotaRepository: IUserQuotaRepository,
  ) {}

  async execute(user_id: string, bonusAmount: number): Promise<void> {
    await this.userQuotaRepository.resetDailyBonus(user_id, bonusAmount);
  }
}
`,
};

// Geração
Object.entries(files).forEach(([relativePath, content]) => {
  const filePath = path.join(basePath, relativePath);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trimStart());
});

console.log('✅ Módulo user_quota criado com sucesso em:', basePath);
