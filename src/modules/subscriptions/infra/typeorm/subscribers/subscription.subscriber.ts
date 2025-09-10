import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Subscription, SubscriptionStatus} from '../entities/Subscription';
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

@EventSubscriber()
export class SubscriptionSubscriber
  implements EntitySubscriberInterface<Subscription>
{
  listenTo() {
    return Subscription;
  }

  beforeInsert(event: InsertEvent<Subscription>) {
    if (!event.entity) return;

    // Define a data de início da assinatura
    event.entity.start_date = new Date();

    // Define a data de expiração com base no tier
    switch (event.entity.tier) {
      case SubscriptionTier.BRONZE:
        event.entity.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
        break;
      case SubscriptionTier.SILVER:
        event.entity.expires_at = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 dias
        break;
      case SubscriptionTier.GOLD:
        event.entity.expires_at = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 dias
        break;
      case SubscriptionTier.INFINITY:
        event.entity.expires_at = null; // nunca expira
        break;
      default:
        event.entity.expires_at = new Date(); // fallback
    }

    // Se é trial, podemos definir expires_at menor (ex.: 7 dias)
    if (event.entity.isTrial) {
      event.entity.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  beforeUpdate(event: UpdateEvent<Subscription>) {
    if (!event.entity) return;

    // Se a assinatura foi cancelada, define expires_at para agora
    if (event.entity.status === SubscriptionStatus.CANCELLED) {
      event.entity.cancelledAt = new Date(); // marca o histórico de cancelamento
      event.entity.expires_at = new Date();
    }
  }
}
