// src/modules/subscriptions/infra/typeorm/seeds/seedSubscriptions.ts
import 'reflect-metadata';
import { container } from 'tsyringe';

import dataSource from '@shared/infra/typeorm/data-source';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export default async function seedSubscriptions() {
  await dataSource.initialize();

  const subscriptionsRepository = container.resolve<ISubscriptionRepository>(
    'SubscriptionsRepository',
  );

  // Usuários de exemplo (trocar por UUIDs reais da tabela users)
  const users = [
    { id: 'user-1-uuid' },
    { id: 'user-2-uuid' },
  ];

  for (const user of users) {
    const existing = await subscriptionsRepository.findByUserId(user.id);
    if (!existing) {
      await subscriptionsRepository.create({
        userId: user.id,
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });
      console.log(`[Seed] Subscription criada para o usuário ${user.id}`);
    } else {
      console.log(`[Seed] Usuário ${user.id} já tinha assinatura`);
    }
  }

  await dataSource.destroy();
}

// 🔽 executa a seed automaticamente
seedSubscriptions()
  .then(() => console.log('[Seed] Subscriptions finalizado ✅'))
  .catch(err => console.error('[Seed] Erro ❌', err));
