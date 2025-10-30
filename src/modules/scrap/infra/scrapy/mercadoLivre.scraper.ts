import axios from "axios";
import * as cheerio from "cheerio";
import { container } from "tsyringe";

import { IScrapedItem } from "../../domain/models/IScrapedItem";
import { IScraperService } from "../../domain/services/IScraperService";
import UserQuotaService from "@modules/user_quota/services/UserQuotaService";
import { SubscriptionTier } from "@modules/subscriptions/enums/subscription-tier.enum";

/**
 * Função utilitária para delay entre requisições
 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Limpa e normaliza URL
 */
function sanitizeUrl(raw: string): string {
  return raw.replace(/[<>]/g, "").trim();
}

/**
 * --- Extração de dados do HTML ---
 */

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
    $(".ui-pdp-shipping__option .andes-money-amount__fraction").first().text().trim() ||
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
  ];

  for (const { selector, status } of possibles)
    if ($(selector).length > 0) return status;

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

  const metaId =
    $('meta[itemprop="productID"]').attr("content") ||
    $('meta[property="og:url"]').attr("content");

  if (metaId) {
    const m = metaId.match(/(MLB[A-Z0-9]+)/i);
    if (m) return m[0];
  }

  const hiddenId = $('input[name="item_id"]').val();
  if (hiddenId) return `MLB${hiddenId}`;

  return null;
}

/**
 * --- SCRAPER PRINCIPAL ---
 */
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
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

      const noStockMsg = $("body").text().includes("indisponível");
      const priceHidden = $(".price").attr("state") === "HIDDEN";

      const finalPrice =
        normalizedPrice && parseFloat(normalizedPrice) > 1
          ? normalizedPrice
          : "0.00";

      if (noStockMsg || priceHidden) itemStatus = "Inativo";

      console.log(`[Scrap] ${targetUrl} ✅`);
      return { title, price: finalPrice, description, shippingInfo, itemStatus, url: targetUrl, itemId };
    } catch (error: any) {
      return {
        title: null,
        price: "0.00",
        description: null,
        shippingInfo: null,
        itemStatus: "error",
        url: targetUrl,
        itemId: null,
        errorDetails: error?.message || "Erro desconhecido ao raspar",
      };
    }
  }

  /**
   * Raspagem de múltiplas URLs com controle de cotas
   */
  async processUrls(urls: string[], userId?: string, delayMs = 1000): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    const quotaService = container.resolve(UserQuotaService);

    if (!userId) {
      console.warn("⚠️ Nenhum userId informado. As cotas não serão debitadas.");
    }

    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      console.log(`\n🔎 [Process] ${i + 1}/${urls.length} -> ${u}`);

      if (userId) {
        const quotaOk = await quotaService.checkQuota(userId, SubscriptionTier.FREE); // ou conforme tier real
        if (!quotaOk) {
          console.log(`🚫 Limite de raspagens atingido para o usuário ${userId}.`);
          break;
        }
        await quotaService.consumeScrape(userId);
      }

      await delay(delayMs);
      const item = await this.scrape(u);
      results.push(item);
    }

    console.log(`\n✅ Raspagem finalizada. Total processado: ${results.length}`);
    return results;
  }
}
