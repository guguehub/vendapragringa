import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import User from '../entities/User';
import AppDataSource from '@shared/infra/typeorm/data-source';

export async function seedUsers(connection?: DataSource): Promise<void> {
  const dataSource = connection || AppDataSource;

  const userRepository = dataSource.getRepository(User);

  console.log('🌱 [Seed] Iniciando seed de usuários...');

  // Usuários padrão (pode ajustar livremente)
  const defaultUsers = [
    {
      id: uuidv4(),
      name: 'Admin Master',
      email: 'admin@vendapragringa.com',
      password: await bcrypt.hash('admin123', 8),
      avatar: null,
    },
    {
      id: uuidv4(),
      name: 'Usuário de Teste',
      email: 'teste@vendapragringa.com',
      password: await bcrypt.hash('123456', 8),
      avatar: null,
    },
  ];

  for (const user of defaultUsers) {
    const exists = await userRepository.findOne({ where: { email: user.email } });

    if (!exists) {
      await userRepository.save(user);
      console.log(`✅ [Seed] Usuário criado: ${user.email}`);
    } else {
      console.log(`⚠️ [Seed] Usuário já existe: ${user.email}`);
    }
  }

  console.log('🎉 [Seed] Seed de usuários finalizada com sucesso!');
}

// Execução direta (caso rode via script npm)
if (require.main === module) {
  AppDataSource.initialize()
    .then(async (connection) => {
      await seedUsers(connection);
      await connection.destroy();
      console.log('🔌 Conexão finalizada.');
    })
    .catch((error) => {
      console.error('❌ Erro ao rodar seedUsers:', error);
    });
}
