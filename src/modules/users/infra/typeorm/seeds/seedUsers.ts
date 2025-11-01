import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import User from '../entities/User';
import AppDataSource from '@shared/infra/typeorm/data-source';

export async function seedUsers(connection?: DataSource): Promise<void> {
  const dataSource = connection || AppDataSource;
  if (!dataSource.isInitialized) await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  console.log('🌱 [Seed] Iniciando seed de usuários...');

  const users = [
    {
      id: uuidv4(),
      name: 'Admin Master',
      email: 'admin@vendapragringa.com',
      password: await hash('admin123', 8),
      is_admin: true,
      hasUsedFreeScrap: false,
      scrape_count: 0,
      scrape_balance: 0,
      daily_bonus_count: 0,
      item_limit: 0,
    },
    {
      id: uuidv4(),
      name: 'Usuário de Teste',
      email: 'user@vendapragringa.com',
      password: await hash('123456', 8),
      is_admin: false,
      hasUsedFreeScrap: false,
      scrape_count: 0,
      scrape_balance: 0,
      daily_bonus_count: 0,
      item_limit: 0,
    },
    {
      id: uuidv4(),
      name: 'Testador',
      email: 'user@venuser@teste.com',
      password: await hash('123456', 8),
      is_admin: false,
      hasUsedFreeScrap: false,
      scrape_count: 0,
      scrape_balance: 0,
      daily_bonus_count: 0,
      item_limit: 0,
    },
  ];

  for (const user of users) {
    const exists = await userRepository.findOne({ where: { email: user.email } });

    if (!exists) {
      await userRepository.save(userRepository.create(user)); // ✅ converte em entidade e evita erro de tipagem
      console.log(`✅ Usuário criado: ${user.email}`);
    } else {
      console.log(`⚠️ Usuário já existe: ${user.email}`);
    }
  }

  console.log('🎉 [Seed] Seed de usuários finalizada!');
}

if (require.main === module) {
  AppDataSource.initialize()
    .then(async connection => {
      await seedUsers(connection);
      await connection.destroy();
      console.log('🔌 Conexão encerrada.');
    })
    .catch(err => {
      console.error('❌ Erro ao rodar seedUsers:', err);
      process.exit(1);
    });
}
