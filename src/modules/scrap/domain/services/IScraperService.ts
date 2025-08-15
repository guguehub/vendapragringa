import { IScrapedItem } from "../models/IScrapedItem";

export interface IScraperService {
  scrape(url: string): Promise<IScrapedItem>;
  processUrls?(urls: string[], delayMs?: number): Promise<IScrapedItem[]>;
}
