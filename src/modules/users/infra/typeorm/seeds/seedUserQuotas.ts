import { DataSource } from 'typeorm';
import User from '../entities/User';
import UserQuota from '@modules/user_quota/infra/typeorm/entities/UserQuota';

export default async function seedUserQuotas(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const quotaRepository = dataSource.getRepository(UserQuota);

  const users = await userRepository.find();

  if (!users.length) {
    console.log('[Seed] Nenhum usuário encontrado — execute antes a seed de usuários.');
    return;
  }

  console.log(`\n[Seed] Criando quotas para ${users.length} usuários...`);

  for (const user of users) {
    const existingQuota = await quotaRepository.findOne({ where: { user_id: user.id } });

    if (existingQuota) {
      console.log(`- ${user.name} já possui quotas.`);
      continue;
    }

    const quota = quotaRepository.create({
      user_id: user.id,
      saved_items_limit: 100, // limite padrão inicial
      scrape_logs_limit: 200, // limite padrão inicial
      created_at: new Date(),
      updated_at: new Date(),
    });

    await quotaRepository.save(quota);
    console.log(`✅ Quotas criadas para ${user.name}`);
  }

  console.log('\n[Seed] SeedUserQuotas finalizado com sucesso!');
}
