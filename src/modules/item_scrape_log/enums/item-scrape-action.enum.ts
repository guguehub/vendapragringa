// src/modules/item_scrape_log/enums/item-scrape-action.enum.ts
export enum ItemScrapeAction {
  SCRAPE_USED = 'SCRAPE_USED', // raspagem consumida
  DAILY_BONUS_RESET = 'DAILY_BONUS_RESET', // bônus diário resetado
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED', // limite atingido
  BONUS_GRANTED = 'BONUS_GRANTED', // bônus concedido (geral)
  SCRAPE_BONUS = 'SCRAPE_BONUS', // bônus de raspagem adicionado
  ITEM_SLOT_USED = 'ITEM_SLOT_USED', // novo: slot de item consumido
}
