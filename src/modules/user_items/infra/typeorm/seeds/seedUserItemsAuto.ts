// src/modules/user_items/infra/typeorm/seeds/seedUserItemsAuto.ts
import { DataSource } from 'typeorm';
import UserItem from '../entities/UserItems';
import User from '@modules/users/infra/typeorm/entities/User';
import Item from '@modules/item/infra/typeorm/entities/Item';

export default async function seedUserItemsAuto(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const itemRepository = dataSource.getRepository(Item);
  const userItemRepository = dataSource.getRepository(UserItem);

  // Busca todos os usuários
  const users = await userRepository.find();
  if (users.length === 0) {
    console.warn('Nenhum usuário encontrado para popular UserItems.');
    return;
  }

  // Pega alguns itens (ex: os primeiros 10)
  const items = await itemRepository.find({ take: 10 });
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
          quantity: 1,
          notes: 'Seed automática',
          importStage: 'draft',
          syncStatus: 'active',

          // 🧩 Campos de snapshot
          snapshotTitle: item.title ?? 'Item sem título',
          snapshotPrice: item.price ? Number(item.price) : 0,
          snapshotImages: Array.isArray(item.images)
            ? item.images
            : item.images
            ? [item.images]
            : [],
          snapshotMarketplace: item.marketplace ?? 'desconhecido',
          snapshotExternalId: item.externalId ?? undefined,


          // 🛒 Campos de eBay e campanha/oferta
          isListedOnEbay: false,
          isOfferEnabled: false,
          isCampaignEnabled: false,
          offerAmount: 0,
          campaignPercent: 0,
          ebayFeePercent: 0,
          useCustomFeePercent: false,
          customFeePercent: 0,
          ebayFeesUsd: 0,
          saleValueUsd: 0,
          exchangeRate: 0,
          receivedBrl: 0,
          itemProfitBrl: 0,
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
