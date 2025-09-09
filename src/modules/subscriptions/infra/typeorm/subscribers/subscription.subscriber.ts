import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Subscription, SubscriptionStatus } from '../entities/Subscription';

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
    event.entity.startDate = new Date();

    // Define a data de expiração com base no tier
    switch (event.entity.tier) {
      case 'bronze':
        event.entity.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
        break;
      case 'silver':
        event.entity.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 dias
        break;
      case 'gold':
        event.entity.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 dias
        break;
      case 'infinity':
        event.entity.expiresAt = null; // nunca expira
        break;
      default:
        event.entity.expiresAt = new Date(); // fallback
    }
  }

  beforeUpdate(event: UpdateEvent<Subscription>) {
    if (!event.entity) return;

    // Se a assinatura foi cancelada, define expiresAt para agora
    if (event.entity.status === SubscriptionStatus.CANCELLED) {
      event.entity.expiresAt = new Date();
    }
  }
}
