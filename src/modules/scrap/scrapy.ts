// scraper.ts

import axios from 'axios';
import cheerio from 'cheerio';

// Utility function to pause execution for a given duration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to extract the product title
function extractTitle($: cheerio.Root): string {
  return $('h1.ui-pdp-title').text().trim();
}

// Function to extract the product price
function extractPrice($: cheerio.Root): string | null {
  const priceContainer = $('.ui-pdp-price__second-line');
  if (priceContainer.length > 0) {
    const priceParts = priceContainer.text().trim().split(',');
    const wholePart = priceParts[0].replace(/\D/g, '');
    const decimalPart = priceParts[1]?.replace(/\D/g, '').padEnd(2, '0') || '00';
    return `${wholePart}.${decimalPart}`;
  } else {
    const rawPrice = $('.andes-money-amount__fraction').first().text().trim();
    return rawPrice ? rawPrice.replace(/[^\d]/g, '').replace(/(\d+)(\d{2})$/, '$1.$2') : null;
  }
}

// Function to extract the product description
function extractDescription($: cheerio.Root): string {
  let description = $('.ui-pdp-description__content').text().trim();
  if (!description) {
    description = $('.ui-pdp-description__title').next().text().trim() || 'Sem descrição disponível';
  }
  return description.substring(0, 64).trim();
}

// Function to extract shipping information
function extractShippingInfo($: cheerio.Root): string {
  const freeShippingText = $('.ui-pdp-color--GREEN.ui-pdp-family--SEMIBOLD').text().toLowerCase();
  if (freeShippingText.includes('grátis')) {
    return 'Frete grátis';
  } else {
    const shippingCost = $('.ui-pdp-shipping__option .andes-money-amount__fraction').text().trim();
    return shippingCost ? `R$ ${shippingCost}` : 'Frete não disponível';
  }
}

// Function to determine the item status
function extractItemStatus($: cheerio.Root): string {
  const statusContainer = $('.ui-pdp-main-actions__status');
  if (statusContainer.length > 0) {
    return statusContainer.text().trim();
  }

  const soldOutStatus = $('.ui-pdp-main-actions__sold-out').text().trim();
  if (soldOutStatus) {
    return 'Esgotado';
  }

  const possibleStatuses = [
    { selector: '.ui-pdp-main-actions__paused', status: 'Pausado' },
    { selector: '.ui-pdp-main-actions__closed', status: 'Encerrado' },
    { selector: '.ui-pdp-main-actions__inactive', status: 'Inativo' },
    { selector: '.ui-pdp-main-actions__under-review', status: 'Sob revisão' },
    { selector: '.ui-pdp-main-actions__payment-required', status: 'Pagamento pendente' },
    { selector: '.ui-pdp-main-actions__finished', status: 'Anúncio finalizado' },
  ];

  for (const { selector, status } of possibleStatuses) {
    if ($(selector).length > 0) {
      return status;
    }
  }

  const pageText = $('body').text().toLowerCase();
  if (pageText.includes('anúncio finalizado')) {
    return 'Anúncio finalizado';
  }

  return 'Ativo';
}

// Function to extract the item ID
function extractItemId(url: string, $: cheerio.Root): string | null {
  const urlPatterns = [
    /(MLB[A-Z]*-?\d+)/i,
    /\/up\/(MLB[A-Z]+\d+)/i,
    /item_id=([A-Z0-9]+)/i,
    /_JM#([A-Z0-9]+)/i,
  ];

  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  const metaId = $('meta[itemprop="productID"]').attr('content') || $('meta[property="og:url"]').attr('content');
  if (metaId) {
    const extracted = metaId.match(/(MLB[A-Z0-9]+)/i);
    if (extracted) return extracted[0];
  }

  const hiddenId = $('input[name="item_id"]').val();
  if (hiddenId) return `MLB${hiddenId}`;

  return null;
}

// Main function to scrape product data from a given URL
export async function scrapeMercadoLivre(url: string) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(html);

    const title = extractTitle($);
    const price = extractPrice($);
    const description = extractDescription($);
    const shippingInfo = extractShippingInfo($);
    const itemStatus = extractItemStatus($);
    const itemId = extractItemId(url, $);

    return { title, price, description, shippingInfo, itemStatus, url, itemId };
  } catch (error: any) {
    const itemStatus = error.response && error.response.status === 400 ? 'Anúncio não disponível' : 'Erro desconhecido';
    const errorDetails = error.message || 'Erro desconhecido';
    return {
      title: null,
      price: null,
      description: null,
      shippingInfo: null,
      itemStatus,
      url,
      itemId: null,
      errorDetails,
    };
  }
}

// Function to process multiple URLs with a delay between requests
export async function processUrls(urls: string[]) {
  const results = [];
  for (const url of urls) {
    try {
      await delay(1000); // Wait for 1 second between requests
      const productDetails = await scrapeMercadoLivre(url);
      results.push(productDetails);
    } catch (error: any) {
      console.error(`Erro ao processar ${url}:`, error.message);
      results.push({ error: true, message: error.message, url });
    }
  }
  console.log('Resultados:', JSON.stringify(results, null, 2));
}
