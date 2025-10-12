import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUserItemsRepository from '../domain/repositories/IUserItemsRepository';
import UserItem from '../infra/typeorm/entities/UserItems';
import { IUpdateUserItemDTO } from '../dtos/IUpdateUserItemDTO';

@injectable()
class UpdateUserItemService {
  constructor(
    @inject('UserItemsRepository')
    private userItemsRepository: IUserItemsRepository,
  ) {}

  public async execute(id: string, userId: string, data: IUpdateUserItemDTO): Promise<UserItem> {
    const userItem = await this.userItemsRepository.findByIdAndUser(id, userId);

    if (!userItem) {
      throw new AppError('Item não encontrado ou não pertence ao usuário', 404);
    }

    // Campos básicos
    if (data.quantity !== undefined) userItem.quantity = data.quantity;
    if (data.notes !== undefined) userItem.notes = data.notes;
    if (data.import_stage !== undefined) userItem.importStage = data.import_stage;
    if (data.sync_status !== undefined) userItem.syncStatus = data.sync_status;

    // Snapshot
    if (data.snapshotTitle !== undefined) userItem.snapshotTitle = data.snapshotTitle;
    if (data.snapshotPrice !== undefined) userItem.snapshotPrice = data.snapshotPrice;
    if (data.snapshotImages !== undefined) userItem.snapshotImages = data.snapshotImages;
    if (data.snapshotMarketplace !== undefined) userItem.snapshotMarketplace = data.snapshotMarketplace;
    if (data.snapshotExternalId !== undefined) userItem.snapshotExternalId = data.snapshotExternalId;

    // eBay / Promoção
    if (data.ebay_title !== undefined) userItem.ebayTitle = data.ebay_title;
    if (data.ebay_link !== undefined) userItem.ebayLink = data.ebay_link;
    if (data.ebay_price !== undefined) userItem.ebayPrice = data.ebay_price;
    if (data.ebay_shipping_weight_grams !== undefined) userItem.ebayShippingWeightGrams = data.ebay_shipping_weight_grams;
    if (data.is_listed_on_ebay !== undefined) userItem.isListedOnEbay = data.is_listed_on_ebay;
    if (data.is_offer_enabled !== undefined) userItem.isOfferEnabled = data.is_offer_enabled;
    if (data.is_campaign_enabled !== undefined) userItem.isCampaignEnabled = data.is_campaign_enabled;
    if (data.offerAmount !== undefined) userItem.offerAmount = data.offerAmount;
    if (data.campaignPercent !== undefined) userItem.campaignPercent = data.campaignPercent;

    // Financeiro
    if (data.ebay_fee_percent !== undefined) userItem.ebayFeePercent = data.ebay_fee_percent;
    if (data.use_custom_fee_percent !== undefined) userItem.useCustomFeePercent = data.use_custom_fee_percent;
    if (data.custom_fee_percent !== undefined) userItem.customFeePercent = data.custom_fee_percent;
    if (data.ebay_fees_usd !== undefined) userItem.ebayFeesUsd = data.ebay_fees_usd;
    if (data.sale_value_usd !== undefined) userItem.saleValueUsd = data.sale_value_usd;
    if (data.exchange_rate !== undefined) userItem.exchangeRate = data.exchange_rate;
    if (data.received_brl !== undefined) userItem.receivedBrl = data.received_brl;
    if (data.item_profit_brl !== undefined) userItem.itemProfitBrl = data.item_profit_brl;

    return this.userItemsRepository.save(userItem);
  }
}

export default UpdateUserItemService;
