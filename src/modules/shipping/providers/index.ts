import { container } from 'tsyringe';

import { IShippingTypeRepository } from '@modules/shipping/domain/repositories/IShippingTypeRepository';
import { IShippingZonesRepository } from '@modules/shipping/domain/repositories/IShippingZonesRepository';
import { IShippingWeightRepository } from '@modules/shipping/domain/repositories/IShippingWeightRepository';
import { IShippingPriceRepository } from '@modules/shipping/domain/repositories/IShippingPriceRepository';

import { ShippingTypesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingTypesRepository';
import { ShippingZonesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingZonesRepository';
import { ShippingWeightsRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingWeightsRepository';
import { ShippingPricesRepository } from '@modules/shipping/infra/typeorm/repositories/ShippingPricesRepository';
import { ShippingZoneCountryRepository } from '../infra/typeorm/repositories/ShippingZoneCountriesRepository';

container.registerSingleton<IShippingTypeRepository>(
  'ShippingTypesRepository',
  ShippingTypesRepository
);

container.registerSingleton<IShippingZonesRepository>(
  'ShippingZonesRepository',
  ShippingZonesRepository
);

container.registerSingleton<IShippingWeightRepository>(
  'ShippingWeightsRepository',
  ShippingWeightsRepository
);

container.registerSingleton<IShippingPriceRepository>(
  'ShippingPricesRepository',
  ShippingPricesRepository
);

container.registerSingleton(
  'ShippingZoneCountryRepository',
  ShippingZoneCountryRepository
);
