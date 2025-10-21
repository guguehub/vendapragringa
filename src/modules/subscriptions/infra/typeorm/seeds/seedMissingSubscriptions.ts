// src/modules/subscriptions/infra/typeorm/seeds/seedMissingSubscriptions.ts

import 'reflect-metadata';
import { container } from 'tsyringe';

import '@shared/container';
import dataSource from '@shared/infra/typeorm/data-source';

import User from '@modules/users/infra/typeorm/entities/User';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/ISubscriptionsRepository';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';
import { SubscriptionStatus } from '@modules/subscriptions/enums/subscription-status.enum';

export default async function seedMissingSubscriptions() {
  console.log('🌱 [Seed] Iniciando verificação de usuários sem assinatura...');

  try {
    await dataSource.initialize();

    const userRepository = dataSource.getRepository(User);
    const subscriptionsRepository = container.resolve<ISubscriptionRepository>(
      'SubscriptionRepository',
    );

    // 🔹 Busca todos os usuários
    const users = await userRepository.find();

    if (!users.length) {
      console.log('⚠️  Nenhum usuário encontrado no banco.');
      return;
    }

    let createdCount = 0;
    let skippedCount = 0;

    // 🔹 Itera sobre todos os usuários e cria subscription se faltar
    for (const user of users) {
      const existing = await subscriptionsRepository.findByUserId(user.id);

      if (!existing) {
        await subscriptionsRepository.create({
          userId: user.id,
          tier: SubscriptionTier.FREE,
          status: SubscriptionStatus.ACTIVE,
          isTrial: false,
          start_date: new Date(),
          expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        });
        console.log(`✅ [Seed] Subscription FREE criada para usuário: ${user.email}`);
        createdCount++;
      } else {
        console.log(`⏭️  [Seed] Usuário ${user.email} já possui assinatura.`);
        skippedCount++;
      }
    }

    console.log(
      `🎉 [Seed] Finalizado! Criadas ${createdCount} novas subscriptions, puladas ${skippedCount}.`,
    );
  } catch (err) {
    console.error('❌ [Seed] Erro ao rodar seedMissingSubscriptions:', err);
  } finally {
    await dataSource.destroy();
    console.log('🔌 [Seed] Conexão com banco encerrada.');
  }
}

// 🔽 Executa automaticamente
seedMissingSubscriptions();
