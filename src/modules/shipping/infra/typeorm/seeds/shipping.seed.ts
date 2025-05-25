import seedShippingTypes from './seedShippingTypes';
import seedShippingZones from './seedShippingZones';
import seedShippingWeights from './seedShippingWeights';
import seedShippingPrices from './seedShippingPrices';

export default async function seedShipping() {
  await seedShippingTypes();
  await seedShippingZones();
  await seedShippingWeights();
  await seedShippingPrices();
}
