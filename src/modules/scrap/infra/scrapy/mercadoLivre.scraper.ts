import axios from "axios";
import * as cheerio from "cheerio";
import { IScrapedItem } from "../../domain/models/IScrapedItem";
import { IScraperService } from "../../domain/services/IScraperService";

// Delay simples para uso em múltiplas URLs (se precisar)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Helpers de extração/normalização ---

function sanitizeUrl(raw: string): string {
  // Remove < > que às vezes vêm de copy/paste (ex: <https://...>)
  const cleaned = raw.replace(/[<>]/g, "").trim();
  return cleaned;
}

function extractTitle($: cheerio.CheerioAPI): string | null {
  const title =
    $("h1.ui-pdp-title").text().trim() ||
    $("h1.item-title__primary").text().trim() ||
    $("meta[property='og:title']").attr("content") ||
    null;

  return title || null;
}

/**
 * Normaliza preço BR ("1.234,56" ou "1.234") para "1234.56".
 * Tenta combinar fração e centavos quando disponíveis em elementos distintos.
 */
function extractPrice($: cheerio.CheerioAPI): string | null {
  // 1) Tentativa 1: ler blocos de preço "modernos" do ML
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
    // Remove qualquer coisa que não seja dígito
    const whole = fraction.replace(/[^\d]/g, "");
    const dec = cents.replace(/[^\d]/g, "").padEnd(2, "0"); // garante 2 dígitos
    if (whole.length > 0) {
      return `${whole}.${dec || "00"}`;
    }
  }

  // 2) Tentativa 2: pegar texto bruto da "segunda linha" e normalizar
  const rawSecondLine = $(".ui-pdp-price__second-line").first().text().trim();
  const normalized = normalizeBrazilianMoney(rawSecondLine);
  if (normalized) return normalized;

  // 3) Tentativa 3: procurar qualquer número de dinheiro no documento
  const fallback = normalizeBrazilianMoney($("body").text());
  return fallback;
}

/**
 * Converte qualquer ocorrência de preço em PT-BR para "1234.56".
 * Retorna null se não identificar um padrão confiável.
 */
function normalizeBrazilianMoney(text: string): string | null {
  if (!text) return null;

  // Procura padrões como "R$ 1.234,56" OU "1.234,56" OU "1.234"
  const moneyRegex =
    /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{2}))?/g;

  let bestMatch: { whole: string; cents?: string } | null = null;

  let match: RegExpExecArray | null;
  while ((match = moneyRegex.exec(text)) !== null) {
    const whole = match[1] || "";
    const cents = match[2] || undefined;

    // Pega o maior número como sendo o principal candidato
    if (!bestMatch || whole.length > bestMatch.whole.length) {
      bestMatch = { whole, cents };
    }
  }

  if (!bestMatch) return null;

  const wholeClean = bestMatch.whole.replace(/\./g, "");
  const centsClean = (bestMatch.cents || "00").padEnd(2, "0");

  if (!/^\d+$/.test(wholeClean)) return null; // sanity check

  return `${wholeClean}.${centsClean}`;
}

function extractDescription($: cheerio.CheerioAPI): string {
  let description =
    $(".ui-pdp-description__content").text().trim() ||
    $(".item-description__text").text().trim() ||
    "";

  if (!description) {
    description =
      $(".ui-pdp-description__title").next().text().trim() || "";
  }

  if (!description) description = "Sem descrição disponível";
  return description.substring(0, 256).trim(); // dá uma enxugada segura
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

  if (shippingCost) return shippingCost;

  return "Frete não disponível";
}

function extractStatus($: cheerio.CheerioAPI): string {
  // Sinais diretos de status
  const soldOut = $(".ui-pdp-main-actions__sold-out").text().trim();
  if (soldOut) return "Esgotado";

  const possibles = [
    { selector: ".ui-pdp-main-actions__paused", status: "Pausado" },
    { selector: ".ui-pdp-main-actions__closed", status: "Encerrado" },
    { selector: ".ui-pdp-main-actions__inactive", status: "Inativo" },
    { selector: ".ui-pdp-main-actions__under-review", status: "Sob revisão" },
    {
      selector: ".ui-pdp-main-actions__payment-required",
      status: "Pagamento pendente",
    },
    { selector: ".ui-pdp-main-actions__finished", status: "Anúncio finalizado" },
  ];

  for (const { selector, status } of possibles) {
    if ($(selector).length > 0) return status;
  }

  // Títulos/subtítulos que às vezes exibem status
  const subtitle =
    $(".ui-pdp-header__subtitle").text().trim() ||
    $(".item-conditions").text().trim();

  if (subtitle) return subtitle;

  // Fallback por palavras-chave
  const pageText = $("body").text().toLowerCase();
  if (pageText.includes("anúncio finalizado")) return "Anúncio finalizado";

  return "Ativo";
}

function extractItemId(url: string, $: cheerio.CheerioAPI): string | null {
  const patterns = [
    /(MLB[A-Z]*-?\d+)/i, // MLB-12345 ou MLBAAA12345
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

// --- Scraper ---

export class MercadoLivreScraper implements IScraperService {
  async scrape(url: string): Promise<IScrapedItem> {
    const targetUrl = sanitizeUrl(url);

    // Validação simples de URL
    if (!/^https?:\/\//i.test(targetUrl)) {
      return {
        title: null,
        price: null,
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
      const normalizedPrice = extractPrice($); // "1234.56" ou null
      const description = extractDescription($);
      const shippingInfo = extractShippingInfo($);
      let itemStatus = extractStatus($);
      const itemId = extractItemId(targetUrl, $);

      // 🧠 Regra de negócio: se não tem preço numérico → Inativo
      if (!normalizedPrice || isNaN(Number(normalizedPrice))) {
        itemStatus = "Inativo";
      }

      return {
        title,
        price: normalizedPrice, // string | null
        description,
        shippingInfo,
        itemStatus,
        url: targetUrl,
        itemId,
      };
    } catch (error: any) {
      const errorDetails = error?.message || "Erro desconhecido ao raspar";
      return {
        title: null,
        price: null,
        description: null,
        shippingInfo: null,
        itemStatus: "error",
        url: targetUrl,
        itemId: null,
        errorDetails,
      };
    }
  }

  // Mantém utilitário para processar múltiplas URLs, raspando 1 por vez
  async processUrls(urls: string[], delayMs = 1000): Promise<IScrapedItem[]> {
    const results: IScrapedItem[] = [];
    for (const u of urls) {
      await delay(delayMs);
      const item = await this.scrape(u);
      results.push(item);
    }
    return results;
  }
}
