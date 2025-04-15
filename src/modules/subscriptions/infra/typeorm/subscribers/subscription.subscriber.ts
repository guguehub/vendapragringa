import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Subscription } from '../entities/Subscription';

@EventSubscriber()
export class SubscriptionSubscriber
  implements EntitySubscriberInterface<Subscription>
{
  listenTo() {
    return Subscription;
  }

  beforeInsert(event: InsertEvent<Subscription>) {
    // Logic before inserting a subscription, e.g., set startDate
    event.entity.startDate = new Date();
    // Set endDate based on tier duration
    // For example, add 30 days for 'bronze' tier
  }

  beforeUpdate(event: UpdateEvent<Subscription>) {
    // Logic before updating a subscription, e.g., handle status changes
    if (event.entity.status === 'cancelled') {
      event.entity.endDate = new Date();
    }
  }
}
