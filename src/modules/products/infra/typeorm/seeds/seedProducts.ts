import 'reflect-metadata';
import { container } from 'tsyringe';

// 🔹 Importa o container para garantir que todos os repositórios estão registrados
import '@shared/container';

import dataSource from '@shared/infra/typeorm/data-source';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';

export default async function seedProducts() {
  try {
    await dataSource.initialize();
    console.log('[Seed] Conexão com o banco inicializada');

    // 🔹 Resolve o repositório já registrado no container
    const productsRepository = container.resolve<IProductsRepository>(
      'ProductsRepository',
    );

    // Planos iniciais
    const products = [
      {
        product_title: 'Plano Bronze',
        description: 'Plano básico com recursos limitados.',
        price: 19.9,
        is_active: true,
        product_url: undefined,
        image_url: undefined,
        payment_method: undefined,
        category: 'plan',
        tags: ['bronze'],
        expiration_date: undefined,
      },
      {
        product_title: 'Plano Prata',
        description: 'Plano intermediário com mais recursos.',
        price: 49.9,
        is_active: true,
        product_url: undefined,
        image_url: undefined,
        payment_method: undefined,
        category: 'plan',
        tags: ['prata'],
        expiration_date: undefined,
      },
      {
        product_title: 'Plano Ouro',
        description: 'Plano avançado com recursos premium.',
        price: 99.9,
        is_active: true,
        product_url: undefined,
        image_url: undefined,
        payment_method: undefined,
        category: 'plan',
        tags: ['ouro'],
        expiration_date: undefined,
      },
      {
        product_title: 'Plano Infinity',
        description: 'Acesso ilimitado e exclusivo.',
        price: 199.9,
        is_active: true,
        product_url: undefined,
        image_url: undefined,
        payment_method: undefined,
        category: 'plan',
        tags: ['infinity'],
        expiration_date: undefined,
      },
    ];

    for (const product of products) {
      const existing = await productsRepository.findByName(product.product_title);
      if (!existing) {
        await productsRepository.create(product);
        console.log(`[Seed] Produto criado: ${product.product_title}`);
      } else {
        console.log(`[Seed] Produto já existia: ${product.product_title}`);
      }
    }

    console.log('[Seed] Products finalizado ✅');
  } catch (err) {
    console.error('[Seed] Erro ❌', err);
  } finally {
    await dataSource.destroy();
    console.log('[Seed] Conexão com o banco finalizada');
  }
}

// 🔽 Para rodar manualmente, descomente a linha abaixo
// seedProducts();
