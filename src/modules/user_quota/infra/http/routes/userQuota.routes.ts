import { Router } from 'express';
import UserQuotaController from '../controllers/UserQuotaController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import { ensureTier } from '@shared/infra/http/middlewares/ensureTier';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

const router = Router();
const controller = new UserQuotaController();

// Middleware obrigatório: usuário autenticado
router.use(isAuthenticated);

// Checa quota – disponível para todos os tiers
router.get('/check', controller.checkQuota.bind(controller));

// Consome quota – exige mínimo Silver, por exemplo (opcional)
router.post(
  '/consume',
  ensureTier(SubscriptionTier.SILVER), // ajuste conforme regra de negócio
  controller.consume.bind(controller),
);

// Reset daily bonus – apenas admin (opcional, se quiser criar um middleware isAdmin)
router.post('/reset-bonus', controller.resetBonus.bind(controller));

export default router;
