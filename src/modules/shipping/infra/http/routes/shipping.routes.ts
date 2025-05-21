import { Router } from 'express';
import { ShippingTypesController } from '../controllers/ShippingTypesController';
import { ShippingZonesController } from '../controllers/ShippingZonesController';
import { ShippingWeightsController } from '../controllers/ShippingWeightsController';
import { CalculateShippingController } from '../controllers/CalculateShippingController';

const shippingRoutes = Router();

const typesController = new ShippingTypesController();
const zonesController = new ShippingZonesController();
const weightsController = new ShippingWeightsController();
const calculateController = new CalculateShippingController();

shippingRoutes.get('/types', typesController.index);
shippingRoutes.get('/zones', zonesController.index);
shippingRoutes.get('/weights', weightsController.index);
shippingRoutes.post('/calculate', calculateController.handle);

export default shippingRoutes;
