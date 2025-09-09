import { hash } from 'bcryptjs';
import dataSource from '@shared/infra/typeorm/data-source';
import User from '../entities/User';

async function seedAdmin() {
  const repo = dataSource.getRepository(User);

  const exists = await repo.findOne({ where: { email: 'admin@example.com' } });
  if (exists) return;

  const passwordHash = await hash('senhaSegura123', 8);

  const adminUser = repo.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: passwordHash,
    is_admin: true,
  });

  await repo.save(adminUser);
  console.log('✅ Admin user created: admin@example.com / senhaSegura123');
}

seedAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
