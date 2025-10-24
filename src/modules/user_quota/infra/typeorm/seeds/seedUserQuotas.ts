import 'reflect-metadata';
import { container } from 'tsyringe';

import dataSource from '@shared/infra/typeorm/data-source';

import CreateUserQuotaService from '@modules/user_quota/services/CreateUserQuotaService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserQuotasRepository from '../repositories/UserQuotaRepository';

export default async function seedUserQuotas(): Promise<void> {
  console.log('🚀 [Seed] Iniciando criação automática de quotas...');

  await dataSource.initialize();

  const usersRepository = new UsersRepository();
  const userQuotasRepository = new UserQuotasRepository();
  const createUserQuota = container.resolve(CreateUserQuotaService);

  const users = await usersRepository.findAll();

  let createdCount = 0;

  for (const user of users) {
    const existingQuota = await userQuotasRepository.findByUserId(user.id);

    if (!existingQuota) {
      await createUserQuota.execute({
        user_id: user.id,
        saved_items_limit: 100,
        scrape_logs_limit: 200,
      });
      createdCount++;
      console.log(`✅ Quota criada para usuário: ${user.email}`);
    } else {
      console.log(`⏩ Usuário ${user.email} já possui quota, ignorando...`);
    }
  }

  console.log(`🎯 [Seed] ${createdCount} quotas criadas com sucesso!`);

  await dataSource.destroy();
}

seedUserQuotas()
  .then(() => console.log('🌱 [Seed] seedUserQuotas finalizada com sucesso!'))
  .catch(err => {
    console.error('❌ Erro ao executar seedUserQuotas:', err);
  });
