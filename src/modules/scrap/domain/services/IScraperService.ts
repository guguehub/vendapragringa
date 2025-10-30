import { IScrapedItem } from "../models/IScrapedItem";

export interface IScraperService {
  /**
   * Raspagem de uma única URL
   */
  scrape(url: string): Promise<IScrapedItem>;

  /**
   * Raspagem de múltiplas URLs, com suporte a controle de cotas por usuário.
   */
  processUrls?(
    urls: string[],
    userId?: string,
    delayMs?: number
  ): Promise<IScrapedItem[]>;
}
