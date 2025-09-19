import axios from "axios";
import * as cheerio from "cheerio";
import { IScrapedItem } from "../../domain/models/IScrapedItem";
import { IScraperService } from "../../domain/services/IScraperService";

// Delay simples para uso em múltiplas URLs
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Helpers de extração/normalização ---

function sanitizeUrl(raw: string): string {
  return raw.replace(/[<>]/g, "").trim(); // remove < >
}

function extractTitle($: cheerio.CheerioAPI): string | null {
  return (
    $("h1.ui-pdp-title").text().trim() ||
    $("h1.item-title__primary").text().trim() ||
    $("meta[property='og:title']").attr("content") ||
    null
  );
}

function normalizeBrazilianMoney(text: string): string | null {
  if (!text) return null;
  const moneyRegex = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{2}))?/g;

  let bestMatch: { whole: string; cents?: string } | null = null;
  let match: RegExpExecArray | null;

  while ((match = moneyRegex.exec(text)) !== null) {
    const whole = match[1] || "";
    const cents = match[2] || undefined;
    if (!bestMatch || whole.length > bestMatch.whole.length) {
      bestMatch = { whole, cents };
    }
  }

  if (!bestMatch) return null;
  const wholeClean = bestMatch.whole.replace(/\./g, "");
  const centsClean = (bestMatch.cents || "00").padEnd(2, "0");

  return /^\d+$/.test(wholeClean) ? `${wholeClean}.${centsClean}` : null;
}

function extractPrice($: cheerio.CheerioAPI): string | null {
  const fraction =
    $(".ui-pdp-price__second-line .price-tag-fraction").first().text().trim() ||
    $(".price-tag-fraction").first().text().trim() ||
    $(".andes-money-amount__fraction").first().text().trim() ||
    "";

  const cents =
    $(".ui-pdp-price__second-line .price-tag-cents").first().text().trim() ||
    $(".price-tag-cents").first().text().trim() ||
    $(".andes-money-amount__cents").first().text().trim() ||
    "";

  if (fraction) {
    const whole = fraction.replace(/[^\d]/g, "");
    const dec = cents.replace(/[^\d]/g, "").padEnd(2, "0");
    if (whole.length > 0) return `${whole}.${dec || "00"}`;
  }

  const rawSecondLine = $(".ui-pdp-price__second-line").first().text().trim();
  const normalized = normalizeBrazilianMoney(rawSecondLine);
  if (normalized) return normalized;

  return normalizeBrazilianMoney($("body").text());
}

function extractDescription($: cheerio.CheerioAPI): string {
  let description =
    $(".ui-pdp-description__content").text().trim() ||
    $(".item-description__text").text().trim() ||
    $(".ui-pdp-description__title").next().text().trim() ||
    "";
  if (!description) description = "Sem descrição disponível";
  return description.substring(0, 256).trim();
}

function extractShippingInfo($: cheerio.CheerioAPI): string {
  const freeShip =
    $(".ui-pdp-color--GREEN.ui-pdp-family--SEMIBOLD").text().toLowerCase();
  if (freeShip.includes("grátis")) return "Frete grátis";

  const shippingCost =
    $(".ui-pdp-shipping__option .andes-money-amount__fraction")
      .first()
      .text()
      .trim() ||
    $(".ui-pdp-shipping-summary__text").first().text().trim() ||
    $(".shipping-method-title").first().text().trim();

  return shippingCost || "Frete não disponível";
}

function extractStatus($: cheerio.CheerioAPI): string {
  if ($(".ui-pdp-main-actions__sold-out").length > 0) return "Esgotado";

  const possibles = [
    { selector: ".ui-pdp-main-actions__paused", status: "Pausado" },
    { selector: ".ui-pdp-main-actions__closed", status: "Encerrado" },
    { selector: ".ui-pdp-main-actions__inactive", status: "Inativo" },
    { selector: ".ui-pdp-main-actions__under-review", status: "Sob revisão" },
    { selector: ".ui-pdp-main-actions__payment-required", status: "Pagamento pendente" },
    { selector: ".ui-pdp-main-actions__finished", status: "Anúncio finalizado" },
  ];

  for (const { selector, status } of possibles) if ($(selector).length > 0) return status;

  const subtitle = $(".ui-pdp-header__subtitle").text().trim() || $(".item-conditions").text().trim();
  if (subtitle) return subtitle;

  const pageText = $("body").text().toLowerCase();
  if (pageText.includes("anúncio finalizado")) return "Anúncio finalizado";

  return "Ativo";
}

function extractItemId(url: string, $: cheerio.CheerioAPI): string | null {
  const patterns = [
    /(MLB[A-Z]*-?\d+)/i,
    /\/up\/(MLB[A-Z]+\d+)/i,
    /item_id=([A-Z0-9]+)/i,
    /_JM#([A-Z0-9]+)/i,
  ];

  for (const p of patterns) {
    const match = url.match(p);
    if (match?.[1]) return match[1];
  }

  const metaId = $('meta[itemprop="productID"]').attr("content") || $('meta[property="og:url"]').attr("content");
  if (metaId) {
    const m = metaId.match(/(MLB[A-Z0-9]+)/i);
    if (m) return m[0];
  }

  const hiddenId = $('input[name="item_id"]').val();
  if (hiddenId) return `MLB${hiddenId}`;

  return null;
}

// --- Scraper ---

export class MercadoLivreScraper implements IScraperService {
  async scrape(url: string): Promise<IScrapedItem> {
    const targetUrl = sanitizeUrl(url);

    if (!/^https?:\/\//i.test(targetUrl)) {
      return {
        title: null,
        price: "0.00",
        description: null,
        shippingInfo: null,
        itemStatus: "error",
        url: targetUrl,
        itemId: null,
        errorDetails: "Invalid URL",
      };
    }

    try {
      const { data: html } = await axios.get(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 5000,
      });

      const $ = cheerio.load(html);

      const title = extractTitle($);
      const normalizedPrice = extractPrice($);
      const description = extractDescription($);
      const shippingInfo = extractShippingInfo($);
      let itemStatus = extractStatus($);
      const itemId = extractItemId(targetUrl, $);

      // --- Regra de negócio: nunca passar null para price ---
      let finalPrice: string;
      const noStockMsg = $("body").text().includes("Este produto está indisponível no momento.");
      const priceHidden = $(".price").attr("state") === "HIDDEN";

      if (normalizedPrice && parseFloat(normalizedPrice) > 1) {
        finalPrice = normalizedPrice;
      } else {
        finalPrice = "0.00";
      }

      if (noStockMsg || priceHidden) {
        itemStatus = "Inativo";
      }

      // Log simples para debug
      console.log(`[Scrap] ${targetUrl}`);
      console.log(`  Title : ${title}`);
      console.log(`  Price : ${finalPrice}`);
      console.log(`  Status: ${itemStatus}`);

      return { title, price: finalPrice, description, shippingInfo, itemStatus, url: targetUrl, itemId };
    } catch (error: any) {
      const errorDetails = error?.message || "Erro desconhecido ao raspar";
      return {
        title: null,
        price: "0.00",
        description: null,
        shippingInfo: null,
        itemStatus: "error",
        url: targetUrl,
        itemId: null,
        errorDetails,
      };
    }
  }

  async processUrls(urls: string[], delayMs = 1000): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    let counter = 1;
    for (const u of urls) {
      console.log(`\n[Process] ${counter}/${urls.length} -> ${u}`);
      await delay(delayMs);
      const item = await this.scrape(u);
      results.push(item);
      counter++;
    }
    return results;
  }
}
