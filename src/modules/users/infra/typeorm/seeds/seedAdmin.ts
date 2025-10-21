import { hash } from 'bcryptjs';
import AppDataSource from '@shared/infra/typeorm/data-source';
import User from '../entities/User';

async function seedAdmin() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);

  let adminUser = await repo.findOne({ where: { email: 'admin@vendapragringa.com' } });
  const passwordHash = await hash('admin123', 8);

  if (!adminUser) {
    adminUser = repo.create({
      name: 'Admin Master',
      email: 'admin@vendapragringa.com',
      password: passwordHash,
      is_admin: true,
    });
    await repo.save(adminUser);
    console.log('✅ Admin user criado: admin@vendapragringa.com');
  } else if (!adminUser.is_admin) {
    adminUser.is_admin = true;
    await repo.save(adminUser);
    console.log('✅ Admin user atualizado para is_admin = true');
  } else {
    console.log('⚙️ Admin já existe com is_admin = true, sem alterações.');
  }

  await AppDataSource.destroy();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro ao rodar seedAdmin:', err);
    process.exit(1);
  });
