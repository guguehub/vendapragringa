// src/modules/subscriptions/infra/typeorm/seeds/seedSubscriptions.ts
import 'reflect-metadata';
import { container } from 'tsyringe';

// 🔹 Importa o container para garantir que todos os repositórios estão registrados
import '@shared/container';

import dataSource from '@shared/infra/typeorm/data-source';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export default async function seedSubscriptions() {
  try {
    await dataSource.initialize();
    console.log('[Seed] Conexão com o banco inicializada');

    // 🔹 Resolve o repositório já registrado no container
    const subscriptionsRepository = container.resolve<ISubscriptionRepository>(
      'SubscriptionRepository',
    );

    // Usuários de exemplo (UUIDs reais devem existir na tabela users)
    const users = [
      { id: '9c0cb0f8-3e26-4762-8421-540dc6580e38' },
      { id: 'baae2218-472d-4edb-98f9-06787f999c4d' },
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

    console.log('[Seed] Subscriptions finalizado ✅');
  } catch (err) {
    console.error('[Seed] Erro ❌', err);
  } finally {
    await dataSource.destroy();
    console.log('[Seed] Conexão com o banco finalizada');
  }
}

// 🔽 Executa a seed automaticamente
seedSubscriptions();
