import { DataSource } from 'typeorm';
import UserItem from '../entities/User_Items';

interface IUserItemSeed {
  user_id: string;
  item_id: string;
  price?: number;
  quantity?: number;
  active?: boolean;
}

const userItemsSeed: IUserItemSeed[] = [
  {
    user_id: 'uuid-user-1', // exemplo João
    item_id: 'uuid-item-1', // exemplo Camisa Brasil
    price: 199.9,
    quantity: 5,
    active: true,
  },
  {
    user_id: 'uuid-user-1',
    item_id: 'uuid-item-2', // Bola
    price: 149.5,
    quantity: 2,
    active: true,
  },
  {
    user_id: 'uuid-user-2', // Maria
    item_id: 'uuid-item-2',
    price: 159,
    quantity: 1,
    active: false,
  },
];

export default async function seedUserItems(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(UserItem);

  for (const userItem of userItemsSeed) {
    const exists = await repository.findOne({
      where: { userId: userItem.user_id, itemId: userItem.item_id },
    });

    if (!exists) {
      const newUserItem = repository.create({
        ...userItem,
        import_stage: 'ready', // pode definir draft, ready, etc. conforme teste
      });
      await repository.save(newUserItem);
    }
  }

  console.log('✅ Seed UserItems rodado com sucesso!');
}
