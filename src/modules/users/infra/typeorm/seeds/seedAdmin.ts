import { hash } from 'bcryptjs';
import dataSource from '@shared/infra/typeorm/data-source';
import User from '../entities/User';

async function seedAdmin() {
  if (!dataSource.isInitialized) await dataSource.initialize();

  const repo = dataSource.getRepository(User);

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
    console.log('✅ Admin user created: admin@vendapragringa.com ');
  } else if (!adminUser.is_admin) {
    adminUser.is_admin = true;
    await repo.save(adminUser);
    console.log('✅ Admin user atualizado para is_admin = true');
  } else {
    console.log('Admin já existe com is_admin = true, pulando seed.');
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
