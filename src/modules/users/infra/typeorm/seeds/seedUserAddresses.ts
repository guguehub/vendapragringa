// src/modules/users/infra/typeorm/seeds/seedUserAddresses.ts
import { DataSource } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import UserAddress from '@modules/users/infra/typeorm/entities/UserAddress';

export async function seedUserAddresses(dataSource: DataSource): Promise<void> {
  console.log('🌱 [Seed] Iniciando seed de endereços de usuário...');

  const userRepository = dataSource.getRepository(User);
  const addressRepository = dataSource.getRepository(UserAddress);

  // 🧍 Busca um usuário existente (ex: admin, ou o primeiro cadastrado)
  const user = await userRepository.findOne({
    where: {},
    order: { created_at: 'ASC' },
  });

  if (!user) {
    console.log('⚠️ Nenhum usuário encontrado. Pulei a seed de endereços.');
    return;
  }

  // 💾 Endereços de exemplo
  const addresses = [
    {
      user_id: user.id,
      street: 'Rua das Américas',
      number: '100',
      complement: 'Ap 202',
      district: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      zip: '80000-000',
      country: 'Brasil',
      country_code: '+55',
      area_code: '41',
      phone_number: '999999999',
      is_default: true,
    },
    {
      user_id: user.id,
      street: 'Av. Paulista',
      number: '1578',
      district: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zip: '01310-200',
      country: 'Brasil',
      country_code: '+55',
      area_code: '11',
      phone_number: '988888888',
      is_default: false,
    },
  ];

  for (const address of addresses) {
    const exists = await addressRepository.findOne({
      where: { user_id: address.user_id, street: address.street },
    });

    if (!exists) {
      await addressRepository.save(addressRepository.create(address));
      console.log(`✅ Endereço criado: ${address.street}, ${address.city}`);
    } else {
      console.log(`ℹ️ Endereço já existente: ${address.street}, ${address.city}`);
    }
  }

  console.log('🎉 [Seed] Seed de endereços de usuário finalizada!');
}
