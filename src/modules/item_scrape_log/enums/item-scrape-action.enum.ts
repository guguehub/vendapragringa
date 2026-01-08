export enum ItemScrapeAction {
  SCRAPE_USED = 'SCRAPE_USED', // raspagem consumida
  DAILY_BONUS_RESET = 'DAILY_BONUS_RESET', // bônus diário resetado
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED', // limite atingido
  BONUS_GRANTED = 'BONUS_GRANTED', // bônus concedido (geral)
  SCRAPE_BONUS = 'SCRAPE_BONUS', // bônus de raspagem adicionado
  ITEM_SLOT_USED = 'ITEM_SLOT_USED', // slot de item consumido
  MONTHLY_RESET = 'MONTHLY_RESET', // 💰 recarga mensal aplicada
    SCRAPE_ERROR = "SCRAPE_ERROR", // ✅ novo tipo de log para falhas de raspagem

}
