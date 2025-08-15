import { IScrapedItem } from "../../domain/models/IScrapedItem";
import { IScraperService } from "../../domain/services/IScraperService";
import axios from "axios";
import * as cheerio from "cheerio";

export class MercadoLivreScraper implements IScraperService {
  async scrape(url: string): Promise<IScrapedItem> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);

      const title =
        $("h1.ui-pdp-title").text().trim() ||
        $("h1.item-title__primary").text().trim() ||
        null;

      const price =
        $(".ui-pdp-price__second-line .price-tag-fraction").first().text().trim() ||
        $(".price-tag-fraction").first().text().trim() ||
        null;

      const description =
        $(".ui-pdp-description__content").text().trim() ||
        $(".item-description__text").text().trim() ||
        null;

      const shippingInfo =
        $(".ui-pdp-shipping-summary__text").text().trim() ||
        $(".shipping-method-title").text().trim() ||
        null;

      const itemStatus =
        $(".ui-pdp-header__subtitle").text().trim() ||
        $(".item-conditions").text().trim() ||
        "unknown";

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
}
