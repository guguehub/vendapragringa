// src/modules/user_items/infra/typeorm/seeds/runSeedUserItemsAuto.ts

import 'reflect-metadata';
import dataSource from '@shared/infra/typeorm/data-source';
import seedUserItemsAuto from './seedUserItemsAuto';

async function run() {
  try {
    await dataSource.initialize();
    console.log('Banco inicializado.');

    await seedUserItemsAuto(dataSource);

    await dataSource.destroy();
    console.log('Conexão encerrada.');
  } catch (error) {
    console.error('Erro ao rodar seed UserItems automática:', error);
    process.exit(1);
  }
}

run();
