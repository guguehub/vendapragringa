import 'dotenv/config'; // tem que ser a PRIMEIRA coisa executada

import dataSource from '@shared/infra/typeorm/data-source';

import seedShippingTypes from './seedShippingTypes';
import seedShippingZones from './seedShippingZones';
import { seedShippingZoneCountries } from './seedShippingZoneCountries';
import seedShippingWeights from './seedShippingWeights';
import seedShippingPrices from './seedShippingPrices';

async function runSeeds() {
  await seedShippingZones(dataSource);
  await seedShippingZoneCountries(dataSource); // deve vir após seedShippingZones
  await seedShippingTypes(dataSource);
  await seedShippingWeights(dataSource);
  await seedShippingPrices(dataSource);
}

dataSource.initialize()
  .then(runSeeds)
  .catch(error => {
    console.error('[Seed] Erro ao inicializar o dataSource:', error);
  });
