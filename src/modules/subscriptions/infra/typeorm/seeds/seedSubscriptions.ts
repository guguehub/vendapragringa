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
      { id: 'a7366d06-ff11-4e97-b306-54beb91cbf10' },
      { id: '876b0e26-a509-47fa-8078-aef31bbda8a0' },
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
