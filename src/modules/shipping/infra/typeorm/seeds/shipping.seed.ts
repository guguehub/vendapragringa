import dataSource from '@shared/infra/typeorm';

import seedShippingTypes from './seedShippingTypes';
import seedShippingZones from './seedShippingZones';
import seedShippingZoneCountries from './seedShippingZoneCountries';
import seedShippingWeights from './seedShippingWeights';
import seedShippingPrices from './seedShippingPrices';

async function runSeeds() {
  await seedShippingZones();
  await seedShippingZoneCountries(); // deve vir após seedShippingZones
  await seedShippingTypes();
  await seedShippingWeights();
  await seedShippingPrices();
}

dataSource.initialize()
  .then(runSeeds)
  .catch(error => {
    console.error('[Seed] Erro ao inicializar o dataSource:', error);
  });
