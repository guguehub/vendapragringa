// src/shared/infra/typeorm/seeds/runSeeds.ts

import dataSource from '@shared/infra/typeorm';
import seedShippingTypes from '@modules/shipping/infra/typeorm/seeds/seedShippingTypes';
// importe aqui os outros seeds que quiser rodar, por exemplo:
// import seedShippingWeights from '@modules/shipping/infra/typeorm/seeds/seedShippingWeights';
// import seedShippingPricesProducts from '@modules/shipping/infra/typeorm/seeds/seedShippingPricesProducts';

async function runSeeds() {
  try {
    await dataSource.initialize();

    console.log('Banco inicializado');

    await seedShippingTypes();
    // await seedShippingWeights();
    // await seedShippingPricesProducts();

    console.log('Seeds rodadas com sucesso!');
  } catch (error) {
    console.error('Erro ao rodar seeds:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexão com banco finalizada');
  }
}

runSeeds();
