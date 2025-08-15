import { IScrapedItem } from "../../domain/models/IScrapedItem";
import { IScraperService } from "../../domain/services/IScraperService";
import axios from "axios";
import * as cheerio from "cheerio";

// Utility function para dar delay se precisar em múltiplas URLs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MercadoLivreScraper implements IScraperService {
  // Função principal para raspar uma URL
  async scrape(url: string): Promise<IScrapedItem> {
    try {
      const { data: html } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 5000,
      });

      const $ = cheerio.load(html);

      // Título do item
      const title =
        $("h1.ui-pdp-title").text().trim() ||
        $("h1.item-title__primary").text().trim() ||
        null;

      // Preço do item
      const price =
        $(".ui-pdp-price__second-line .price-tag-fraction").first().text().trim() ||
        $(".price-tag-fraction").first().text().trim() ||
        null;

      // Descrição do item
      const description =
        $(".ui-pdp-description__content").text().trim() ||
        $(".item-description__text").text().trim() ||
        "Sem descrição disponível";

      // Informações de frete
      const shippingInfo =
        $(".ui-pdp-shipping-summary__text").text().trim() ||
        $(".shipping-method-title").text().trim() ||
        "Frete não disponível";

      // Status do item
      const itemStatus =
        $(".ui-pdp-header__subtitle").text().trim() ||
        $(".item-conditions").text().trim() ||
        "unknown";

      // ID do item extraído da URL
      const itemId = url.match(/ML[B|A|M|U|C]\d+/)?.[0] || null;

      return {
        title,
        price,
        description,
        shippingInfo,
        itemStatus,
        url,
        itemId,
      };
    } catch (error: any) {
      return {
        title: null,
        price: null,
        description: null,
        shippingInfo: null,
        itemStatus: "error",
        url,
        itemId: null,
        errorDetails: error.message || "Erro desconhecido ao raspar",
      };
    }
  }

  // Função auxiliar para processar múltiplas URLs com delay entre requests
  async processUrls(urls: string[], delayMs = 1000): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];

    for (const url of urls) {
      await delay(delayMs);
      const item = await this.scrape(url);
      results.push(item);
    }

    return results;
  }
}
