// src/modules/user_items/infra/typeorm/seeds/seedUserItemsAuto.ts

import { DataSource, In } from 'typeorm';
import UserItem from '../entities/UserItems';
import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item';

export default async function seedUserItemsAuto(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const itemRepository = dataSource.getRepository(Item);
  const userItemRepository = dataSource.getRepository(UserItem);

  // Pega todos os usuários
  const users = await userRepository.find();
  if (users.length === 0) {
    console.warn('Nenhum usuário encontrado para popular UserItems.');
    return;
  }

  // Pega alguns items (ex: os primeiros 10)
  const items = await itemRepository.find({
    take: 10,
  });
  if (items.length === 0) {
    console.warn('Nenhum item encontrado para popular UserItems.');
    return;
  }

  const userItemsToInsert: Partial<UserItem>[] = [];

  for (const user of users) {
    for (const item of items) {
      // Evita duplicatas
      const exists = await userItemRepository.findOne({
        where: { userId: user.id, itemId: item.id },
      });
      if (!exists) {
        userItemsToInsert.push({
          userId: user.id,
          itemId: item.id,
          importStage: 'draft',
          syncStatus: 'active',
          notes: 'Seed automática',
        });
      }
    }
  }

  if (userItemsToInsert.length > 0) {
    await userItemRepository.save(userItemsToInsert);
    console.log(`${userItemsToInsert.length} UserItems inseridos com seed automática.`);
  } else {
    console.log('Todos os UserItems já existiam. Nenhum registro inserido.');
  }
}
