import { Router } from 'express';
import { ShippingTypesController } from '../controllers/ShippingTypesController';
import { ShippingZonesController } from '../controllers/ShippingZonesController';
import { ShippingWeightsController } from '../controllers/ShippingWeightsController';
import { CalculateShippingController } from '../controllers/CalculateShippingController';

import ShippingPricesController from '../controllers/ShippingPricesController';



const shippingRoutes = Router();

const typesController = new ShippingTypesController();
const zonesController = new ShippingZonesController();
const weightsController = new ShippingWeightsController();
const calculateController = new CalculateShippingController();

const shippingPricesController = new ShippingPricesController();


shippingRoutes.get('/types', typesController.index);
shippingRoutes.get('/zones', zonesController.index);
shippingRoutes.get('/weights', weightsController.index);
shippingRoutes.post('/calculate', calculateController.handle);

// Atualizar preço de frete
shippingRoutes.put('/prices/:id', shippingPricesController.update);
// Deletar preço de frete
shippingRoutes.delete('/prices/:id', shippingPricesController.delete);



export default shippingRoutes;
