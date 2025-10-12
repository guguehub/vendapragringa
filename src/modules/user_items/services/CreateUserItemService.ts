import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import IItemsRepository from '@modules/item/domain/repositories/IItemsRepository';
import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';
import { ICreateUserItemDTO } from '../dtos/ICreateUserItemDTO';
import UserItem from '../infra/typeorm/entities/UserItems';

@injectable()
class CreateUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,
  ) {}

  public async execute(data: ICreateUserItemDTO): Promise<UserItem> {
    const {
      user_id,
      item_id,
      quantity = 1,
      notes,
      snapshotTitle: incomingSnapshotTitle,
      snapshotPrice: incomingSnapshotPrice,
      snapshotImages: incomingSnapshotImages,
      snapshotMarketplace: incomingSnapshotMarketplace,
      snapshotExternalId: incomingSnapshotExternalId,
      ebay_title,
      ebay_link,
      ebay_price,
      ebay_shipping_weight_grams,
      is_listed_on_ebay,
      is_offer_enabled,
      is_campaign_enabled,
      offerAmount,
      campaignPercent,
      ebay_fee_percent,
      use_custom_fee_percent,
      custom_fee_percent,
      ebay_fees_usd,
      sale_value_usd,
      exchange_rate,
      received_brl,
      item_profit_brl,
      import_stage,
      sync_status,
    } = data;

    // 🧩 Validações básicas
    if (quantity < 1) {
      throw new AppError('A quantidade deve ser pelo menos 1.');
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const item = await this.itemsRepository.findById(item_id);
    if (!item) {
      throw new AppError('Item não encontrado.', 404);
    }

    // 🔍 Verifica se já existe um registro do mesmo item para o usuário
    const existing = await this.userItemsRepository.findByUserAndItem(user_id, item_id);

    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity;

      if (notes !== undefined) existing.notes = notes;
      if (incomingSnapshotTitle !== undefined) existing.snapshotTitle = incomingSnapshotTitle;
      if (incomingSnapshotPrice !== undefined) existing.snapshotPrice = incomingSnapshotPrice;
      if (incomingSnapshotImages !== undefined)
        existing.snapshotImages = Array.isArray(incomingSnapshotImages)
          ? incomingSnapshotImages
          : [incomingSnapshotImages];
      if (incomingSnapshotMarketplace !== undefined)
        existing.snapshotMarketplace = incomingSnapshotMarketplace;
      if (incomingSnapshotExternalId !== undefined)
        existing.snapshotExternalId = incomingSnapshotExternalId;

      if (ebay_title !== undefined) existing.ebayTitle = ebay_title;
      if (ebay_link !== undefined) existing.ebayLink = ebay_link;
      if (ebay_price !== undefined) existing.ebayPrice = ebay_price;
      if (ebay_shipping_weight_grams !== undefined)
        existing.ebayShippingWeightGrams = ebay_shipping_weight_grams;

      if (is_listed_on_ebay !== undefined) existing.isListedOnEbay = is_listed_on_ebay;
      if (is_offer_enabled !== undefined) existing.isOfferEnabled = is_offer_enabled;
      if (is_campaign_enabled !== undefined) existing.isCampaignEnabled = is_campaign_enabled;

      if (offerAmount !== undefined) existing.offerAmount = offerAmount;
      if (campaignPercent !== undefined) existing.campaignPercent = campaignPercent;

      if (ebay_fee_percent !== undefined) existing.ebayFeePercent = ebay_fee_percent;
      if (use_custom_fee_percent !== undefined)
        existing.useCustomFeePercent = use_custom_fee_percent;
      if (custom_fee_percent !== undefined) existing.customFeePercent = custom_fee_percent;
      if (ebay_fees_usd !== undefined) existing.ebayFeesUsd = ebay_fees_usd;
      if (sale_value_usd !== undefined) existing.saleValueUsd = sale_value_usd;
      if (exchange_rate !== undefined) existing.exchangeRate = exchange_rate;
      if (received_brl !== undefined) existing.receivedBrl = received_brl;
      if (item_profit_brl !== undefined) existing.itemProfitBrl = item_profit_brl;
      if (import_stage !== undefined) existing.importStage = import_stage;
      if (sync_status !== undefined) existing.syncStatus = sync_status;

      return this.userItemsRepository.save(existing);
    }

    // 🧱 Valores padrão para novo registro
    const snapshotTitle = incomingSnapshotTitle ?? item.title ?? undefined;
    const snapshotPrice =
      incomingSnapshotPrice ?? (item.price ? Number(item.price) : undefined);

    const snapshotImages: string[] = Array.isArray(incomingSnapshotImages)
      ? incomingSnapshotImages
      : Array.isArray(item.images)
      ? item.images
      : incomingSnapshotImages
      ? [incomingSnapshotImages]
      : [];

    const snapshotMarketplace = incomingSnapshotMarketplace ?? item.marketplace;
    const snapshotExternalId = incomingSnapshotExternalId ?? item.externalId;

    // 🧾 Monta payload final
    const createPayload: ICreateUserItemDTO = {
      user_id,
      item_id,
      quantity,
      notes,
      snapshotTitle,
      snapshotPrice,
      snapshotImages, // ✅ Agora é string[]
      snapshotMarketplace,
      snapshotExternalId,
      ebay_title,
      ebay_link,
      ebay_price,
      ebay_shipping_weight_grams,
      is_listed_on_ebay,
      is_offer_enabled,
      is_campaign_enabled,
      offerAmount,
      campaignPercent,
      ebay_fee_percent,
      use_custom_fee_percent,
      custom_fee_percent,
      ebay_fees_usd,
      sale_value_usd,
      exchange_rate,
      received_brl,
      item_profit_brl,
      import_stage: import_stage ?? 'draft',
      sync_status,
    };

    const created = await this.userItemsRepository.create(createPayload);
    return this.userItemsRepository.save(created);
  }
}

export default CreateUserItemService;
