import axios from 'axios';
import * as cheerio from 'cheerio';

// Utility function to pause execution for a given duration
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Normaliza o preço para não quebrar inserção no banco
function normalizePrice(price: string | null, itemStatus: string): string {
  const numericPrice = price ? parseFloat(price) : 0;
  if (numericPrice > 1) {
    return price!; // mantém preço real
  }
  // Se não tiver preço ou for 0, mantém 0.00
  return '0.00';
}

// Function to extract the product title
function extractTitle($: cheerio.CheerioAPI): string {
  return $('h1.ui-pdp-title').text().trim();
}

// Function to extract the product price
function extractPrice($: cheerio.CheerioAPI): string | null {
  const priceContainer = $('.ui-pdp-price__second-line');
  if (priceContainer.length > 0) {
    const priceParts = priceContainer.text().trim().split(',');
    const wholePart = priceParts[0].replace(/\D/g, '');
    const decimalPart =
      priceParts[1]?.replace(/\D/g, '').padEnd(2, '0') || '00';
    return `${wholePart}.${decimalPart}`;
  } else {
    const rawPrice = $('.andes-money-amount__fraction').first().text().trim();
    return rawPrice
      ? rawPrice.replace(/[^\d]/g, '').replace(/(\d+)(\d{2})$/, '$1.$2')
      : null;
  }
}

// Function to extract the product description
function extractDescription($: cheerio.CheerioAPI): string {
  let description = $('.ui-pdp-description__content').text().trim();
  if (!description) {
    description =
      $('.ui-pdp-description__title').next().text().trim() ||
      'Sem descrição disponível';
  }
  return description.substring(0, 64).trim();
}

// Function to extract shipping information
function extractShippingInfo($: cheerio.CheerioAPI): string {
  const freeShippingText = $('.ui-pdp-color--GREEN.ui-pdp-family--SEMIBOLD')
    .text()
    .toLowerCase();
  if (freeShippingText.includes('grátis')) {
    return 'Frete grátis';
  } else {
    const shippingCost = $(
      '.ui-pdp-shipping__option .andes-money-amount__fraction',
    )
      .text()
      .trim();
    return shippingCost ? `R$ ${shippingCost}` : 'Frete não disponível';
  }
}

// Function to determine the item status
function extractItemStatus($: cheerio.CheerioAPI): string {
  const statusContainer = $('.ui-pdp-main-actions__status');
  if (statusContainer.length > 0) return statusContainer.text().trim();

  const soldOutStatus = $('.ui-pdp-main-actions__sold-out').text().trim();
  if (soldOutStatus) return 'Esgotado';

  const possibleStatuses = [
    { selector: '.ui-pdp-main-actions__paused', status: 'Pausado' },
    { selector: '.ui-pdp-main-actions__closed', status: 'Encerrado' },
    { selector: '.ui-pdp-main-actions__inactive', status: 'Inativo' },
    { selector: '.ui-pdp-main-actions__under-review', status: 'Sob revisão' },
    { selector: '.ui-pdp-main-actions__payment-required', status: 'Pagamento pendente' },
    { selector: '.ui-pdp-main-actions__finished', status: 'Anúncio finalizado' },
  ];

  for (const { selector, status } of possibleStatuses) {
    if ($(selector).length > 0) return status;
  }

  const pageText = $('body').text().toLowerCase();
  if (pageText.includes('anúncio finalizado')) return 'Anúncio finalizado';
  if (pageText.includes('este produto está indisponível no momento')) return 'Inativo';

  return 'Ativo';
}

// Function to extract the item ID
function extractItemId(url: string, $: cheerio.CheerioAPI): string | null {
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

  const metaId =
    $('meta[itemprop="productID"]').attr('content') ||
    $('meta[property="og:url"]').attr('content');
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
    const rawPrice = extractPrice($);
    const itemStatus = extractItemStatus($);
    const price = normalizePrice(rawPrice, itemStatus);
    const description = extractDescription($);
    const shippingInfo = extractShippingInfo($);
    const itemId = extractItemId(url, $);

    // Log detalhado
    console.log(`[SCRAPER] ${title} | Price: ${price} | Status: ${itemStatus}`);

    return { title, price, description, shippingInfo, itemStatus, url, itemId };
  } catch (error: any) {
    const itemStatus =
      error.response && error.response.status === 400
        ? 'Anúncio não disponível'
        : 'Erro desconhecido';
    const errorDetails = error.message || 'Erro desconhecido';
    console.log(`[SCRAPER ERROR] URL: ${url} | Status: ${itemStatus} | Detalhe: ${errorDetails}`);
    return {
      title: null,
      price: '0.00',
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
  let counter = 0;
  const total = urls.length;
  const results = [];

  for (const url of urls) {
    counter++;
    try {
      await delay(1000); // Wait for 1 second between requests
      const productDetails = await scrapeMercadoLivre(url);
      results.push(productDetails);

      // Log simples de progresso
      console.log(`[PROGRESS] ${counter}/${total} URLs processadas.`);
    } catch (error: any) {
      console.error(`[ERROR] URL: ${url} | ${error.message}`);
      results.push({ error: true, message: error.message, url });
    }
  }

  console.log('Resultados finais:', JSON.stringify(results, null, 2));
}

// URLs para testar
const urls = [
  'https://produto.mercadolivre.com.br/MLB-2197404989',
  'https://www.mercadolivre.com.br/cd-jonnata-doll-e-garotos-solventes-crocodilo-2016-sem-uso/up/MLBU1412331913#polycard_client=search-nordic&searchVariation=MLBU1412331913&wid=MLB1980905943&position=1&search_layout=grid&type=product&tracking_id=277d54e2-291e-4ae5-8b4f-cfafd14d3824&sid=search',
  'https://www.mercadolivre.com.br/lp-explorations-bill-evans-trio/up/MLBU1481610204',
  'https://produto.mercadolivre.com.br/MLB-4225368926',
  'https://www.mercadolivre.com.br/cd-tool--undertow--1993/up/MLBU1095682064?pdp_filters=item_id:MLB1615267043#position=16&search_layout=grid&type=item&tracking_id=1a1e374c-5d2d-46ac-8584-5935122b937b',
  'https://produto.mercadolivre.com.br/MLB-2138286985-boneco-transformers-estrela-antigo-saltman-1986-_JM#position=12&search_layout=grid&type=item&tracking_id=92d515e3-543a-4834-a125-666721600d16',
  'https://www.mercadolivre.com.br/cd-tool--undertow--1993/up/MLBU1095682064?pdp_filters=item_id:MLB1615267043#position=16&search_layout=grid&type=item&tracking_id=1a1e374c-5d2d-46ac-8584-5935122b937b',
  'https://produto.mercadolivre.com.br/MLB-2115545019-fonte-de-alimentaco-para-karaoke-vmp-3700-ou-3700-plus-_JM#polycard_client=recommendations_home_navigation-recommendations&reco_backend=machinalis-homes-univb-equivalent-offer&reco_client=home_navigation-recommendations&reco_item_pos=2&reco_backend_type=function&reco_id=fa9a43e9-9243-40b9-b1ac-41dacb7b2835&c_id=/home/navigation-recommendations/element&c_uid=621d89a6-1728-4d9a-99ff-796684ffe85b',
  'https://produto.mercadolivre.com.br/MLB-5190895718-prizm-card-neymar-jr-copa-mundo-2014-psa-9-_JM?searchVariation=182308606698#polycard_client=search-nordic&searchVariation=182308606698&position=5&search_layout=grid&type=item&tracking_id=8fa41ef2-16fc-4aaf-8661-188bb6bcac0d',


];

// Processar os URLs
processUrls(urls);
