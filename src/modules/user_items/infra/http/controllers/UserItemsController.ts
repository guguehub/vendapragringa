// src/modules/user_items/infra/http/controllers/UserItemsController.ts
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserItemDTO } from '@modules/user_items/dtos/CreateUserItemDTO';
import { ICreateUserItemDTO } from '@modules/user_items/dtos/ICreateUserItemDTO';

import CreateUserItemService from '@modules/user_items/services/CreateUserItemService';
import ListUserItemsService from '@modules/user_items/services/ListUserItemsService';
import ShowUserItemService from '@modules/user_items/services/ShowUserItemService';
import UpdateUserItemService from '@modules/user_items/services/UpdateUserItemService';
import DeleteUserItemService from '@modules/user_items/services/DeleteUserItemService';
import UserQuotaService from '@modules/user_quota/services/UserQuotaService';

export default class UserItemsController {
  // GET /user_items
  public async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    if (!userId) return response.status(401).json({ message: 'Usuário não autenticado.' });

    const service = container.resolve(ListUserItemsService);
    const items = await service.execute(userId);

    return response.json(items);
  }

  // GET /user_items/:id
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const userId = request.user?.id;
    if (!userId) return response.status(401).json({ message: 'Usuário não autenticado.' });

    const service = container.resolve(ShowUserItemService);
    const item = await service.execute(id, userId);

    return response.json(item);
  }

  // POST /user_items
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id;
    if (!userId) return response.status(401).json({ message: 'Usuário não autenticado.' });

    const dto = Object.assign(new CreateUserItemDTO(), request.body);
    const data: ICreateUserItemDTO = {
      user_id: userId,
      item_id: dto.item_id,
      quantity: dto.quantity,
      notes: dto.notes,
      import_stage: dto.import_stage,
      sync_status: dto.sync_status,
      snapshotTitle: dto.snapshotTitle,
      snapshotPrice: dto.snapshotPrice,
      snapshotImages: dto.snapshotImages,
      snapshotMarketplace: dto.snapshotMarketplace,
      snapshotExternalId: dto.snapshotExternalId,
      ebay_title: dto.ebay_title,
      ebay_link: dto.ebay_link,
      ebay_price: dto.ebay_price,
      ebay_shipping_weight_grams: dto.ebay_shipping_weight_grams,
      is_listed_on_ebay: dto.is_listed_on_ebay,
      is_offer_enabled: dto.is_offer_enabled,
      is_campaign_enabled: dto.is_campaign_enabled,
      ebay_fee_percent: dto.ebay_fee_percent,
      use_custom_fee_percent: dto.use_custom_fee_percent,
      custom_fee_percent: dto.custom_fee_percent,
      ebay_fees_usd: dto.ebay_fees_usd,
      sale_value_usd: dto.sale_value_usd,
      exchange_rate: dto.exchange_rate,
      received_brl: dto.received_brl,
      item_profit_brl: dto.item_profit_brl,
    };

    const quotaService = container.resolve(UserQuotaService);
    const createUserItemService = container.resolve(CreateUserItemService);

    // ✅ Consome 1 slot de item da quota antes de criar
    await quotaService.consumeItemSlot(userId);

    const userItem = await createUserItemService.execute(data);

    console.log(`[USER_ITEM] 🧾 Item criado para user:${userId} - item_id:${userItem.id}`);

    return response.status(201).json(userItem);
  }

  // PUT /user_items/:id
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const userId = request.user?.id;
    if (!userId) return response.status(401).json({ message: 'Usuário não autenticado.' });

    const service = container.resolve(UpdateUserItemService);
    const updated = await service.execute(id, userId, request.body);

    return response.json(updated);
  }

  // DELETE /user_items/:id
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const userId = request.user?.id;
    if (!userId) return response.status(401).json({ message: 'Usuário não autenticado.' });

    const service = container.resolve(DeleteUserItemService);
    await service.execute(id, userId);

    return response.status(204).send();
  }
}
